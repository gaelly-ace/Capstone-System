"""
Improved GRU-based sequence model for RFID pig checkpoint prediction + anomaly detection.

Improvements over prior versions:
- Saves metadata including maxlen, vocab_size and schema_version.
- Uses a validation split and reports validation accuracy.
- Sets deterministic seeds for reproducibility.
"""
import sqlite3
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, GRU, Dense
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping
import os
import json
import random
from datetime import datetime

# -----------------------
# Configuration & maps
# -----------------------
DB_PATH = "slaughterhouse.db"
MODEL_PATH = "model_gru.h5"
MODEL_META_PATH = "model_meta.json"
CHECKPOINT_MAP = {"holding_pen": 1, "slaughter_area": 2, "exit_point": 3}
INV_CHECKPOINT_MAP = {v: k for k, v in CHECKPOINT_MAP.items()}

# Training hyperparams
EMBED_DIM = 16
GRU_UNITS = 64
EPOCHS = 30
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.2
SEED = 42
SCHEMA_VERSION = 1

# Set seeds for reproducibility
np.random.seed(SEED)
random.seed(SEED)
tf.random.set_seed(SEED)

# -----------------------
# DB helpers
# -----------------------
def init_db_if_missing():
    """Create example DB/tables if not exist (safe to run)"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS pigs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rfid TEXT UNIQUE,
                    dealer TEXT,
                    gender TEXT,
                    weight REAL,
                    registered_at TEXT
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS scans (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pig_id TEXT,
                    checkpoint TEXT,
                    timestamp TEXT
                )''')
    conn.commit()
    conn.close()

# -----------------------
# Data loading & prep
# -----------------------
def load_scan_sequences():
    """
    Load scans from DB, order by timestamp, and group into sequences by pig_id.
    Returns dict: rfid -> [1,2,3,...] (mapped ints)
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT pig_id, checkpoint, timestamp FROM scans ORDER BY timestamp ASC")
    rows = c.fetchall()
    conn.close()

    pig_sequences = {}
    for pig_id, checkpoint, _ in rows:
        if checkpoint not in CHECKPOINT_MAP:
            # Log unknown checkpoint once (could be extended to a logger)
            # For now skip silently
            continue
        mapped = CHECKPOINT_MAP[checkpoint]
        if pig_id not in pig_sequences:
            pig_sequences[pig_id] = []
        pig_sequences[pig_id].append(mapped)
    return pig_sequences

def build_xy_from_sequences(pig_sequences):
    """
    Builds X (list of prefix lists) and Y (next-step ints)
    Example: seq [1,2,3] -> pairs ([1],2), ([1,2],3)
    """
    X, Y = [], []
    for seq in pig_sequences.values():
        if len(seq) < 2:
            continue
        for i in range(1, len(seq)):
            X.append(seq[:i])
            Y.append(seq[i])
    return X, Y

# -----------------------
# Model build / train
# -----------------------
def build_model(vocab_size, maxlen):
    """Builds the Keras GRU sequence model."""
    model = Sequential([
        Embedding(input_dim=vocab_size, output_dim=EMBED_DIM, input_length=maxlen),
        GRU(GRU_UNITS),
        Dense(vocab_size, activation="softmax")
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model

def train_and_save_model(X, Y, model_path=MODEL_PATH, meta_path=MODEL_META_PATH):
    """Trains the model, saves it, and saves metadata (maxlen, vocab_size, schema_version)."""
    if not X:
        print("[TRAIN] Not enough sequence pairs to train.")
        return None, None, None

    # 1. Determine Maxlen and Pad
    maxlen = max(len(x) for x in X)
    X_pad = pad_sequences(X, maxlen=maxlen, padding="pre")
    Y_arr = np.array(Y)

    # 2. Determine Vocab Size (Fixed Checkpoints + 1 for padding '0')
    vocab_size = max(CHECKPOINT_MAP.values()) + 1

    # 3. Shuffle and split into train/validation
    idx = np.arange(len(X_pad))
    np.random.shuffle(idx)
    X_pad = X_pad[idx]
    Y_arr = Y_arr[idx]

    val_count = max(1, int(len(X_pad) * VALIDATION_SPLIT))
    train_X = X_pad[:-val_count]
    train_Y = Y_arr[:-val_count]
    val_X = X_pad[-val_count:]
    val_Y = Y_arr[-val_count:]

    # 4. Build and Train
    model = build_model(vocab_size=vocab_size, maxlen=maxlen)
    print(f"[TRAIN] train shape: {train_X.shape}, val shape: {val_X.shape}, vocab_size: {vocab_size}, maxlen: {maxlen}")
    callbacks = [EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)]
    history = model.fit(train_X, train_Y, validation_data=(val_X, val_Y), epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1, callbacks=callbacks)

    # report final metrics on validation set
    val_loss, val_acc = model.evaluate(val_X, val_Y, verbose=0)
    print(f"[TRAIN] Validation loss: {val_loss:.4f}, val_acc: {val_acc:.4f}")

    # 5. Save Model and Metadata
    os.makedirs(os.path.dirname(model_path) or ".", exist_ok=True)
    model.save(model_path)

    metadata = {
        'maxlen': int(maxlen),
        'vocab_size': int(vocab_size),
        'schema_version': SCHEMA_VERSION,
        'seed': int(SEED),
    }
    with open(meta_path, 'w') as f:
        json.dump(metadata, f)

    print(f"[TRAIN] Model saved to {model_path}. Metadata saved to {meta_path}.")
    return model, maxlen, vocab_size

# -----------------------
# Prediction & anomaly logic
# -----------------------
def load_model_safe(path=MODEL_PATH, meta_path=MODEL_META_PATH):
    """Loads model and required metadata (maxlen, vocab_size).
    Returns (model, maxlen, vocab_size) or (None, None, None) on failure."""
    if not os.path.exists(path) or not os.path.exists(meta_path):
        return None, None, None

    try:
        model = tf.keras.models.load_model(path)
        with open(meta_path, 'r') as f:
            metadata = json.load(f)
        return model, metadata.get('maxlen'), metadata.get('vocab_size')
    except Exception as e:
        print(f"[ERROR] Could not load model or metadata: {e}")
        return None, None, None

def is_registered(rfid):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM pigs WHERE rfid=?", (rfid,))
    r = c.fetchone()
    conn.close()
    return r is not None

def get_latest_sequence_for_rfid(rfid):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT checkpoint FROM scans WHERE pig_id=? ORDER BY timestamp ASC", (rfid,))
    rows = c.fetchall()
    conn.close()
    return [CHECKPOINT_MAP[row[0]] for row in rows if row[0] in CHECKPOINT_MAP]

def rule_based_check(seq):
    if not seq:
        return {"status": "unknown", "message": "No scans yet"}

    if seq == [1, 2, 3]:
        return {"status": "normal", "message": "Normal full process (Slaughtered & Exited)"}
    if seq == [1, 3]:
        return {"status": "report_required", "message": "Early exit (Skipped Slaughter) - requires Culling/Death report"}
    if seq == [2, 3]:
        return {"status": "anomaly", "message": "Skipped holding pen (2,3)"}
    if seq == [3]:
        return {"status": "anomaly", "message": "Appeared directly at Exit (3)"}

    if len(seq) >= 2 and seq[-1] < seq[-2]:
        return {"status": "anomaly", "message": f"Backtracking detected ({INV_CHECKPOINT_MAP[seq[-2]]} to {INV_CHECKPOINT_MAP[seq[-1]]})"}

    if len(seq) >= 3 and len(set(seq[-3:])) == 1:
        return {"status": "anomaly", "message": f"Looping/duplicate scans detected at {INV_CHECKPOINT_MAP[seq[-1]]}"}

    if len(seq) >= 2 and seq[-2:] == [1,2]:
        return {"status": "suspicious", "message": "In Slaughter area - pending Exit scan."}

    return {"status": "unknown", "message": "No rule matched - sending to model for sequence prediction check"}

def detect_event(rfid, model, maxlen):
    if not is_registered(rfid):
        return {"result": "anomaly", "reason": "Unregistered UID (no dealer info)", "action": "Alert: Pig must be registered."}

    seq = get_latest_sequence_for_rfid(rfid)
    if not seq:
        return {"result": "unknown", "reason": "No scans for this pig yet.", "action": "Accept first scan, wait for next."}

    rule = rule_based_check(seq)
    if rule["status"] in ("normal", "report_required", "anomaly"):
        return {"result": rule["status"], "reason": rule["message"], "action": "Process complete or Rule-based flag."}

    if model is None:
        return {"result": "unknown", "reason": "No model available. Review manually."}

    prefix_seq = seq[:-1]
    actual_next = seq[-1]
    if not prefix_seq:
        return {"result": "unknown", "reason": "First scan. Accepting scan, waiting for next."}

    seq_padded = pad_sequences([prefix_seq], maxlen=maxlen, padding="pre")
    pred = model.predict(seq_padded, verbose=0)[0]
    predicted_next = int(np.argmax(pred))
    prob = float(np.max(pred))
    confidence_threshold = 0.6

    predicted_checkpoint_name = INV_CHECKPOINT_MAP.get(predicted_next, "Unknown")
    actual_checkpoint_name = INV_CHECKPOINT_MAP.get(actual_next, "Unknown")

    if prob >= confidence_threshold and predicted_next != actual_next:
        return {
            "result": "anomaly",
            "reason": f"Sequence Deviation: Pig scanned at {actual_checkpoint_name} ({actual_next}) but model confidently expected {predicted_checkpoint_name} ({predicted_next}).",
            "action": "ALERT: Sequencing error detected.",
            "expected_best": predicted_checkpoint_name,
            "model_confidence": prob
        }
    elif prob < confidence_threshold:
        return {"result": "suspicious", "reason": "Model low confidence for this sequence. Manual review recommended.", "model_confidence": prob}
    else:
        return {"result": "normal", "reason": f"Model confirms highly likely sequence. Expected next: {predicted_checkpoint_name}"}

# -----------------------
# Example usage & training flow
# -----------------------
def main_train_flow():
    init_db_if_missing()
    pig_sequences = load_scan_sequences()
    if not pig_sequences:
        print("[INFO] No sequences found in DB. Insert scans or use test data first.")
        return None, None, None

    X, Y = build_xy_from_sequences(pig_sequences)
    if not X:
        print("[INFO] Not enough sequence pairs to train. Need sequences with length >=2.")
        return None, None, None

    return train_and_save_model(X, Y)

def example_demo_run():
    init_db_if_missing()

    model, maxlen, vocab = load_model_safe(MODEL_PATH, MODEL_META_PATH)
    if model is None:
        print("[INFO] No saved model or metadata found. Attempting to train from DB (if data exists).")
        model_and_meta = main_train_flow()
        if model_and_meta == (None, None, None):
            print("[INFO] Training not performed (no data). Demo cannot run anomaly checks.")
            return
        model, maxlen, vocab = model_and_meta

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT DISTINCT pig_id FROM scans LIMIT 5")
    rows = c.fetchall()
    conn.close()
    demo_rfids = [r[0] for r in rows]

    if not demo_rfids:
        print("[INFO] No scanned pigs found for demo. Add scans to DB or register and scan pigs first.")
        return

    print("\n--- Running Anomaly Detection Examples ---")
    for rfid in demo_rfids:
        result = detect_event(rfid, model, maxlen)
        print(f"RFID: {rfid} -> {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    example_demo_run()
