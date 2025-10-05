"""
GRU-based sequence model for RFID pig checkpoint prediction + anomaly detection.

Expected DB: slaughterhouse.db with tables:
 - pigs(id INTEGER PRIMARY KEY, rfid TEXT UNIQUE, dealer TEXT, gender TEXT, weight REAL, registered_at TEXT)
 - scans(id INTEGER PRIMARY KEY, pig_id INTEGER, checkpoint TEXT, timestamp TEXT)

How it works:
1) Load historical scans ordered by timestamp and group by pig (rfid).
2) Build (X -> next_event) training pairs and pad sequences.
3) Train GRU to predict next checkpoint.
4) detect_event(seq, rfid) applies:
   - unregistered check
   - rule checks (e.g., [1,3] => requires report)
   - model-based check (model predicts next; if actual deviates in anomalous way, flag)
   - Gagraduate tayong lahat
"""
import sqlite3
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, GRU, Dense
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
import json
from datetime import datetime

# -----------------------
# Configuration & maps
# -----------------------
DB_PATH = "slaughterhouse.db"
MODEL_PATH = "model_gru.h5"
CHECKPOINT_MAP = {"holding_pen": 1, "slaughter_area": 2, "exit_point": 3}
INV_CHECKPOINT_MAP = {v: k for k, v in CHECKPOINT_MAP.items()}

# Training hyperparams
EMBED_DIM = 16
GRU_UNITS = 64
EPOCHS = 30
BATCH_SIZE = 32

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
                    pig_id TEXT,          -- pig RF ID stored as text; simplified
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
    Load scans joined with pigs ordered by timestamp.
    Returns dict: rfid -> [1,2,3,...] (mapped ints)
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # We assume scans are stored with pig_id as RFID string. If using integer FK, adapt accordingly.
    c.execute("SELECT pig_id, checkpoint, timestamp FROM scans ORDER BY timestamp ASC")
    rows = c.fetchall()
    conn.close()

    pig_sequences = {}
    for pig_id, checkpoint, ts in rows:
        if checkpoint not in CHECKPOINT_MAP:
            # skip unknown checkpoint strings
            continue
        mapped = CHECKPOINT_MAP[checkpoint]
        if pig_id not in pig_sequences:
            pig_sequences[pig_id] = []
        pig_sequences[pig_id].append(mapped)
    return pig_sequences

def build_xy_from_sequences(pig_sequences, min_pair_len=1):
    """
    Given dict of sequences, build X (list of prefix lists) and Y (next-step ints)
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
    model = Sequential([
        Embedding(input_dim=vocab_size, output_dim=EMBED_DIM, input_length=maxlen),
        GRU(GRU_UNITS),
        Dense(vocab_size, activation="softmax")
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model

def train_and_save_model(X, Y, model_path=MODEL_PATH):
    # pad X
    maxlen = max(len(x) for x in X)
    X_pad = pad_sequences(X, maxlen=maxlen, padding="pre")
    Y_arr = np.array(Y)

    # vocab_size needs to be max checkpoint id + 1 (to include zero if used for padding)
    vocab_size = max(max(y for y in Y_arr), max(max(x) for x in X)) + 1

    model = build_model(vocab_size=vocab_size, maxlen=maxlen)
    print(f"[TRAIN] X shape: {X_pad.shape}, Y shape: {Y_arr.shape}, vocab_size: {vocab_size}, maxlen: {maxlen}")
    model.fit(X_pad, Y_arr, epochs=EPOCHS, batch_size=BATCH_SIZE, verbose=1)
    os.makedirs(os.path.dirname(model_path) or ".", exist_ok=True)
    model.save(model_path)
    print(f"[TRAIN] Model saved to {model_path}")
    return model, maxlen, vocab_size

# -----------------------
# Prediction & anomaly logic
# -----------------------
def load_model_safe(path=MODEL_PATH):
    if not os.path.exists(path):
        return None
    return tf.keras.models.load_model(path)

def is_registered(rfid):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id FROM pigs WHERE rfid=?", (rfid,))
    r = c.fetchone()
    conn.close()
    return r is not None

def get_latest_sequence_for_rfid(rfid, limit=None):
    """
    Fetch all checkpoints for a given rfid ordered by timestamp and map to ints.
    Returns list of ints.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT checkpoint FROM scans WHERE pig_id=? ORDER BY timestamp ASC", (rfid,))
    rows = c.fetchall()
    conn.close()
    seq = [CHECKPOINT_MAP[row[0]] for row in rows if row[0] in CHECKPOINT_MAP]
    if limit:
        return seq[-limit:]
    return seq

def rule_based_check(seq, rfid):
    """
    Rule checks:
    - Unregistered UID handled outside (call is_registered first)
    - [1,2,3] -> normal
    - [1,3] -> early exit -> require report (not anomaly)
    - [2,3] -> anomaly: skipped holding pen
    - [3] -> anomaly: appeared directly at exit
    - backtracking -> anomaly
    - looping -> anomaly
    - [1,2] with long time w/o exit -> anomaly (this function doesn't check time)
    """
    if not seq or len(seq) == 0:
        return {"status": "unknown", "message": "No scans yet"}

    # direct exact matches
    if seq == [1, 2, 3]:
        return {"status": "normal", "message": "Normal full process"}
    if seq == [1, 3]:
        return {"status": "report_required", "message": "Early exit - requires report (died/sick/other)"}
    if seq == [2, 3]:
        return {"status": "anomaly", "message": "Skipped holding pen (2,3)"}
    if seq == [3]:
        return {"status": "anomaly", "message": "Appeared directly at exit (3)"}

    # backtracking
    if len(seq) >= 2:
        for i in range(1, len(seq)):
            if seq[i] < seq[i-1]:
                return {"status": "anomaly", "message": "Backtracking detected (impossible flow)"}

    # looping: same checkpoint repeatedly many times
    if len(seq) >= 3 and len(set(seq[-3:])) == 1:
        return {"status": "anomaly", "message": "Looping/duplicate scans detected"}

    # missing exit after slaughter area (1,2 but no 3 yet) -> could be pending, but treat as suspicious
    if seq[-2:] == [1,2]:
        return {"status": "suspicious", "message": "In slaughter area but no exit scan yet"}

    return {"status": "unknown", "message": "No rule matched - send to model"}

def detect_event(rfid, model, maxlen):
    """
    Called when a new scan arrives (or on-demand) for rfid.
    - Loads latest sequence for that RFID
    - Performs registration check and rule-based checks
    - If rule says unknown, uses model to predict next and compares to observed
    Returns dict with result and recommended action.
    """
    # 1) registration
    if not is_registered(rfid):
        return {"result": "anomaly", "reason": "Unregistered UID (no dealer info)", "action": "Register via QR"}

    seq = get_latest_sequence_for_rfid(rfid)
    if not seq:
        return {"result": "unknown", "reason": "No scans for this pig yet", "action": "Wait for more scans or register"}

    # run rule based
    rule = rule_based_check(seq, rfid)
    if rule["status"] == "normal":
        return {"result": "normal", "reason": rule["message"]}
    if rule["status"] == "report_required":
        return {"result": "report_required", "reason": rule["message"], "report_fields": ["died", "sick", "other_text"]}
    if rule["status"] == "anomaly":
        return {"result": "anomaly", "reason": rule["message"], "action": "Alert operator"}
    if rule["status"] in ("suspicious", "unknown"):
        # use model if available
        if model is None:
            return {"result": "unknown", "reason": rule["message"], "action": "No model available; review manually"}
        # prepare input for model: we want to predict the next checkpoint after current seq
        seq_padded = pad_sequences([seq], maxlen=maxlen, padding="pre")
        pred = model.predict(seq_padded, verbose=0)[0]  # vector of probs over vocab
        predicted_next = int(np.argmax(pred))
        prob = float(np.max(pred))

        # If model predicts next with high confidence but actual next differs, anomaly.
        # For real-time detection, compare predicted_next with last observed step? Usually you'd compare predicted vs actual arrival.
        # Here we check expected next checkpoint vs last observed checkpoint to decide:
        # If last observed is a terminal state (exit), we consider process ended.
        # If predicted_next is same as last observed, likely waiting for next scan.
        last_observed = seq[-1]
        # We check two things:
        #  - If model predicts a next step different from what normal flow says and observed sequence looks wrong => anomaly
        #  - If model confidence low, return unknown
        confidence_threshold = 0.6

        # If model confident and predicted_next is not a valid continuation (e.g., predicted 2 but observed was 3 directly), flag
        # But we only have observed seq; the 'actual next' will be known after a future scan. So here we advise expected_next.
        expected_next = predicted_next
        if prob < confidence_threshold:
            return {"result": "unknown", "reason": "Model low confidence", "model_confidence": prob, "expected_next": expected_next}
        else:
            return {
                "result": "model_suggestion",
                "reason": rule["message"],
                "expected_next": expected_next,
                "model_confidence": prob,
                "note": "If future observed next deviates from expected and is not [1,3] report case, flag anomaly"
            }

# -----------------------
# Example usage & training flow
# -----------------------
def main_train_flow():
    init_db_if_missing()
    pig_sequences = load_scan_sequences()
    if not pig_sequences:
        print("[INFO] No sequences found in DB. Insert scans or use test data first.")
        return

    X, Y = build_xy_from_sequences(pig_sequences)
    if not X:
        print("[INFO] Not enough sequence pairs to train. Need sequences with length >=2.")
        return

    model, maxlen, vocab = train_and_save_model(X, Y)
    return model, maxlen

def example_demo_run():
    """
    Demo: - train if possible, then show detection examples
    """
    # make sure db exists and maybe contains data
    init_db_if_missing()

    # Try to load existing model
    model = load_model_safe(MODEL_PATH)
    maxlen = None
    if model is None:
        print("[INFO] No saved model found. Attempting to train from DB (if data exists).")
        model_and_meta = main_train_flow()
        if model_and_meta is None:
            print("[INFO] Training not performed (no data). Demo will continue without model.")
            model = None
            # set default maxlen for pad usage (1) to avoid errors; model won't be used
            maxlen = 3
        else:
            model, maxlen = model_and_meta
    else:
        # Need to infer maxlen from training data; we'll read sequences and compute max prefix length used during training
        pig_sequences = load_scan_sequences()
        X, Y = build_xy_from_sequences(pig_sequences)
        maxlen = max(len(x) for x in X) if X else 3

    # Demo: you can insert test entries manually into DB or rely on existing DB
    # Example detection calls:
    # Replace 'RFID_DEMO_1' with actual RFID in your DB or insert test rows inside sqlite browser
    demo_rfids = []
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT DISTINCT pig_id FROM scans LIMIT 5")
    rows = c.fetchall()
    conn.close()
    demo_rfids = [r[0] for r in rows]

    if not demo_rfids:
        print("[INFO] No scanned pigs found for demo. Add scans to DB or register and scan pigs first.")
        return

    for rfid in demo_rfids:
        result = detect_event(rfid, model, maxlen)
        print(f"RFID: {rfid} -> {json.dumps(result, indent=2)}")

if __name__ == "__main__":
    # Run demo: trains model if needed, then runs detection examples
    example_demo_run()





