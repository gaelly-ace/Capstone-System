/* ===== Sidebar active state (unchanged UI) ===== */
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', function () {
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
    li.classList.add('active');
  });
});

/* ===== Toggle sidebar (unchanged) ===== */
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
menuBar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});

/* ===== Search (unchanged) ===== */
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle('show');
    if (searchForm.classList.contains('show')) {
      searchButtonIcon.classList.replace('bx-search', 'bx-x');
    } else {
      searchButtonIcon.classList.replace('bx-x', 'bx-search');
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add('hide');
} else if (window.innerWidth > 900) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
});

/* ===== Theme (no-flash) — uses 'dark-mode'; DOES NOT set checkbox ===== */
const switchMode = document.getElementById('switch-mode');
const htmlEl = document.documentElement;
const bodyEl = document.body;

function setTheme(dark) {
  bodyEl.classList.toggle('dark', dark);
  localStorage.setItem('dark-mode', dark ? 'true' : 'false');
}

// initial theme from storage (doesn't touch checkbox)
setTheme(localStorage.getItem('dark-mode') === 'true');

// toggle without transitions; checkbox state only changes from user click
if (switchMode) {
  switchMode.addEventListener('change', () => {
    htmlEl.classList.add('theme-switching');
    bodyEl.classList.add('theme-switching');
    setTheme(!!switchMode.checked);
    requestAnimationFrame(() => {
      htmlEl.classList.remove('theme-switching');
      bodyEl.classList.remove('theme-switching');
    });
  });
}

/* ===== Anti-flash navigation guard for sidebar (no UI change) ===== */
let navDebounce = false;

function paintLock() {
  const dark = localStorage.getItem('dark-mode') === 'true';
  const bg = dark ? '#0C0C1E' : '#F9F9F9';
  htmlEl.classList.toggle('dark', dark); // keeps html bg correct
  bodyEl.classList.toggle('dark', dark); // keeps variables stable
  htmlEl.classList.add('theme-switching');
  bodyEl.classList.add('theme-switching');
  htmlEl.style.backgroundColor = bg;
  bodyEl.style.backgroundColor = bg;
}

document.querySelectorAll('#sidebar .side-menu.top li a').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/+$/, '');
    const current = window.location.pathname.replace(/\/+$/, '');
    const same = target === current || (target === '' && current.endsWith('/'));

    // If it's the current page (e.g., Reports on reports.html), don't reload → no flash
    if (same) {
      e.preventDefault();
      return;
    }

    // Debounce spam clicks (first click goes through)
    if (navDebounce) {
      e.preventDefault();
      return;
    }
    navDebounce = true;
    setTimeout(() => navDebounce = false, 350);

    // Lock the paint to the right theme before navigating
    paintLock();
    requestAnimationFrame(() => { window.location.href = a.href; });
    e.preventDefault();
  });
});

/* ===== Tables & data (unchanged) ===== */
// ANOMALIES DATA - Live food reports with anomalies
const anomaliesData = [
  { id:"LF001", kind:"Pig",    gender:"Male",   weight:"85 kg",  status:"Holding Pen",  anomalies:"Skin lesions on back leg", reportedBy:"Dr. Santos", dateReported:"2024-08-05", severity:"Medium" },
  { id:"LF003", kind:"Cattle", gender:"Female", weight:"420 kg", status:"Slaughterhouse", anomalies:"Limping, swollen joints", reportedBy:"Vet. Cruz",  dateReported:"2024-08-04", severity:"High" },
  { id:"LF007", kind:"Carabao",gender:"Male",   weight:"480 kg", status:"Holding Pen",  anomalies:"Respiratory issues, coughing", reportedBy:"Dr. Reyes", dateReported:"2024-08-03", severity:"High" },
  { id:"LF012", kind:"Pig",    gender:"Female", weight:"92 kg",  status:"Holding Pen",  anomalies:"Loss of appetite, lethargy", reportedBy:"Vet. Garcia", dateReported:"2024-08-02", severity:"Medium" },
  { id:"LF015", kind:"Cattle", gender:"Male",   weight:"510 kg", status:"Exit",         anomalies:"Minor cuts from transport", reportedBy:"Dr. Santos", dateReported:"2024-08-01", severity:"Low" }
];

// REQUESTS DATA - Password changes and record edit/archive requests
const requestsData = [
  { id:"REQ001", type:"Password Change", requestedBy:"John Doe",    role:"Veterinarian", details:"Forgot current password",                dateRequested:"2024-08-05", status:"Pending" },
  { id:"REQ002", type:"Edit Record",     requestedBy:"Maria Santos",role:"Admin Assistant", details:"Update weight for LF008 - Cattle",   dateRequested:"2024-08-04", status:"Approved" },
  { id:"REQ003", type:"Archive Record",  requestedBy:"Carlos Reyes",role:"Supervisor",    details:"Archive completed records from July",   dateRequested:"2024-08-04", status:"Pending" },
  { id:"REQ004", type:"Password Change", requestedBy:"Ana Garcia",  role:"Veterinarian",  details:"Security update - regular password change", dateRequested:"2024-08-03", status:"Completed" },
  { id:"REQ005", type:"Edit Record",     requestedBy:"Roberto Cruz",role:"Data Entry",    details:"Correct anomaly description for LF003", dateRequested:"2024-08-02", status:"Rejected" },
  { id:"REQ006", type:"Archive Record",  requestedBy:"Lisa Torres", role:"Admin Assistant", details:"Archive inactive livestock records",  dateRequested:"2024-08-01", status:"Pending" }
];

function handleAnomalyAction(action, anomalyId, rowElement) {
  const dataItem = anomaliesData.find(item => item.id === anomalyId);
  if (!dataItem) return;
  switch (action) {
    case 'view':
      alert(`Anomaly Details:\n\nLive Food ID: ${dataItem.id}\nKind: ${dataItem.kind}\nAnomalies: ${dataItem.anomalies}\nReported by: ${dataItem.reportedBy}\nDate: ${dataItem.dateReported}\nSeverity: ${dataItem.severity}`);
      break;
    case 'resolve':
      if (confirm(`Mark anomaly for ${dataItem.kind} (${anomalyId}) as resolved?`)) {
        rowElement.style.opacity = '0.5';
        rowElement.style.backgroundColor = '#d4edda';
        const actionCell = rowElement.querySelector('td:last-child');
        actionCell.innerHTML = '<span style="color:#28a745;font-weight:bold;">Resolved</span>';
      }
      break;
  }
}

function handleRequestAction(action, requestId) {
  const dataItem = requestsData.find(item => item.id === requestId);
  if (!dataItem) return;
  switch (action) {
    case 'approve':
      if (confirm(`Approve request ${requestId}?`)) {
        dataItem.status = 'Approved';
        populateRequestsTable();
      }
      break;
    case 'reject':
      if (confirm(`Reject request ${requestId}?`)) {
        dataItem.status = 'Rejected';
        populateRequestsTable();
      }
      break;
    case 'view':
      alert(`Request Details:\n\nRequest ID: ${dataItem.id}\nType: ${dataItem.type}\nRequested by: ${dataItem.requestedBy}\nRole: ${dataItem.role}\nDetails: ${dataItem.details}\nDate: ${dataItem.dateRequested}\nStatus: ${dataItem.status}`);
      break;
  }
}

function populateAnomaliesTable() {
  const tbody = document.querySelector("#anomalies-table tbody");
  tbody.innerHTML = "";
  anomaliesData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.kind}</td>
      <td>${item.gender}</td>
      <td>${item.weight}</td>
      <td style="font-weight:bold;${item.status==='Holding Pen'?'color:#ffc107':item.status==='Slaughterhouse'?'color:#dc3545':'color:#28a745'}">${item.status}</td>
      <td style="color:#dc3545">${item.anomalies}</td>
      <td style="font-weight:bold;${item.severity==='Low'?'color:#28a745':item.severity==='Medium'?'color:#ffc107':'color:#dc3545'}">${item.severity}</td>
      <td>
        <button class="view-btn">View</button>
        <button class="resolve-btn">Resolve</button>
      </td>
    `;
    row.querySelector(".view-btn").onclick = () => handleAnomalyAction('view', item.id, row);
    row.querySelector(".resolve-btn").onclick = () => handleAnomalyAction('resolve', item.id, row);
    tbody.appendChild(row);
  });
}

function populateRequestsTable() {
  const tbody = document.querySelector("#requests-table tbody");
  tbody.innerHTML = "";
  requestsData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.type}</td>
      <td>${item.requestedBy}</td>
      <td>${item.role}</td>
      <td>${item.details}</td>
      <td>${item.dateRequested}</td>
      <td style="font-weight:bold;${item.status==='Pending'?'color:#ffc107':item.status==='Approved'?'color:#28a745':item.status==='Completed'?'color:#17a2b8':'color:#dc3545'}">${item.status}</td>
      <td>
        ${item.status==='Pending'
          ? '<button class="approve-btn">Approve</button><button class="reject-btn">Reject</button>'
          : ''
        }
        <button class="view-btn">View</button>
      </td>
    `;
    if (item.status === 'Pending') {
      row.querySelector(".approve-btn").onclick = () => handleRequestAction('approve', item.id);
      row.querySelector(".reject-btn").onclick = () => handleRequestAction('reject', item.id);
    }
    row.querySelector(".view-btn").onclick = () => handleRequestAction('view', item.id);
    tbody.appendChild(row);
  });
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  const notificationCountElement = document.getElementById('notificationCount');
  const storedCount = localStorage.getItem('notificationCount');
  if (storedCount !== null) notificationCountElement.textContent = storedCount;

  populateAnomaliesTable();
  populateRequestsTable();
});

/* ===== QR Scanner (unchanged) ===== */
let html5QrCode;
function startQrScanner() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(() => {
      document.getElementById("qr-scanner").style.display = "block";
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeMessage => {
          alert("Scanned: " + qrCodeMessage);
          stopQrScanner();
        },
        errorMessage => console.warn("Scanning error", errorMessage)
      );
    })
    .catch(() => {
      alert("Camera access denied. Returning to site.");
      window.location.href = "/";
    });
}
function stopQrScanner() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      document.getElementById("qr-scanner").style.display = "none";
    }).catch(err => console.error("Stop error:", err));
  }
}
