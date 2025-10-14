const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
  const li = item.parentElement;
  item.addEventListener('click', function () {
    allSideMenu.forEach(i=> i.parentElement.classList.remove('active'));
    li.classList.add('active');
  })
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});

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
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
});

/* ===========================
   THEME (no-flash, unified)
   =========================== */
const switchMode = document.getElementById('switch-mode');
const docEl = document.documentElement;
const THEME_KEY = 'theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    docEl.classList.add('dark');            // html.dark for prepaint bg
    document.body.classList.add('dark');    // body.dark for CSS vars
    if (switchMode) switchMode.checked = true;
  } else {
    docEl.classList.remove('dark');
    document.body.classList.remove('dark');
    if (switchMode) switchMode.checked = false;
  }
  localStorage.setItem(THEME_KEY, theme);
}

// On load: match the HTML preloader
applyTheme(localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');

// Toggle with transition-kill wrapper
if (switchMode) {
  switchMode.addEventListener('change', () => {
    docEl.classList.add('theme-changing');
    document.body.classList.add('theme-changing');

    const next = switchMode.checked ? 'dark' : 'light';
    applyTheme(next);

    // allow a frame, then re-enable transitions for the rest of the UI
    requestAnimationFrame(() => {
      docEl.classList.remove('theme-changing');
      document.body.classList.remove('theme-changing');
    });
  });
}

/* ===========================
   DATA + TABLE POPULATION
   (unchanged)
   =========================== */
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
        console.log(`Anomaly ${anomalyId} marked as resolved`);
      }
      break;
  }
}

function handleRequestAction(action, requestId, rowElement) {
  const dataItem = requestsData.find(item => item.id === requestId);
  if (!dataItem) return;
  switch (action) {
    case 'approve':
      if (confirm(`Approve request ${requestId}?`)) {
        dataItem.status = 'Approved';
        populateRequestsTable();
        console.log(`Request ${requestId} approved`);
      }
      break;
    case 'reject':
      if (confirm(`Reject request ${requestId}?`)) {
        dataItem.status = 'Rejected';
        populateRequestsTable();
        console.log(`Request ${requestId} rejected`);
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

    const idCell = document.createElement("td"); idCell.textContent = item.id; row.appendChild(idCell);
    const kindCell = document.createElement("td"); kindCell.textContent = item.kind; row.appendChild(kindCell);
    const genderCell = document.createElement("td"); genderCell.textContent = item.gender; row.appendChild(genderCell);
    const weightCell = document.createElement("td"); weightCell.textContent = item.weight; row.appendChild(weightCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = item.status;
    switch(item.status) {
      case 'Holding Pen': statusCell.style.color = '#ffc107'; statusCell.style.fontWeight = 'bold'; break;
      case 'Slaughterhouse': statusCell.style.color = '#dc3545'; statusCell.style.fontWeight = 'bold'; break;
      case 'Exit': statusCell.style.color = '#28a745'; statusCell.style.fontWeight = 'bold'; break;
    }
    row.appendChild(statusCell);

    const anomaliesCell = document.createElement("td");
    anomaliesCell.textContent = item.anomalies;
    anomaliesCell.style.color = '#dc3545';
    row.appendChild(anomaliesCell);

    const severityCell = document.createElement("td");
    severityCell.textContent = item.severity;
    switch(item.severity) {
      case 'Low': severityCell.style.color = '#28a745'; break;
      case 'Medium': severityCell.style.color = '#ffc107'; break;
      case 'High': severityCell.style.color = '#dc3545'; break;
    }
    severityCell.style.fontWeight = 'bold';
    row.appendChild(severityCell);

    const actionCell = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("view-btn");
    viewButton.onclick = () => handleAnomalyAction('view', item.id, row);
    actionCell.appendChild(viewButton);

    const resolveButton = document.createElement("button");
    resolveButton.textContent = "Resolve";
    resolveButton.classList.add("resolve-btn");
    resolveButton.onclick = () => handleAnomalyAction('resolve', item.id, row);
    actionCell.appendChild(resolveButton);

    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

function populateRequestsTable() {
  const tbody = document.querySelector("#requests-table tbody");
  tbody.innerHTML = "";
  requestsData.forEach((item) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td"); idCell.textContent = item.id; row.appendChild(idCell);
    const typeCell = document.createElement("td"); typeCell.textContent = item.type; row.appendChild(typeCell);
    const requestedByCell = document.createElement("td"); requestedByCell.textContent = item.requestedBy; row.appendChild(requestedByCell);
    const roleCell = document.createElement("td"); roleCell.textContent = item.role; row.appendChild(roleCell);
    const detailsCell = document.createElement("td"); detailsCell.textContent = item.details; row.appendChild(detailsCell);
    const dateCell = document.createElement("td"); dateCell.textContent = item.dateRequested; row.appendChild(dateCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = item.status;
    switch(item.status) {
      case 'Pending':   statusCell.style.color = '#ffc107'; break;
      case 'Approved':  statusCell.style.color = '#28a745'; break;
      case 'Completed': statusCell.style.color = '#17a2b8'; break;
      case 'Rejected':  statusCell.style.color = '#dc3545'; break;
    }
    statusCell.style.fontWeight = 'bold';
    row.appendChild(statusCell);

    const actionCell = document.createElement("td");
    if (item.status === 'Pending') {
      const approveButton = document.createElement("button");
      approveButton.textContent = "Approve";
      approveButton.classList.add("approve-btn");
      approveButton.onclick = () => handleRequestAction('approve', item.id, row);
      actionCell.appendChild(approveButton);

      const rejectButton = document.createElement("button");
      rejectButton.textContent = "Reject";
      rejectButton.classList.add("reject-btn");
      rejectButton.onclick = () => handleRequestAction('reject', item.id, row);
      actionCell.appendChild(rejectButton);
    }

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.classList.add("view-btn");
    viewButton.onclick = () => handleRequestAction('view', item.id, row);
    actionCell.appendChild(viewButton);

    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}

// Initialize tables after DOM loads & keep notification count behavior
document.addEventListener("DOMContentLoaded", () => {
  const notificationCountElement = document.getElementById('notificationCount');

  function updateNotificationCount() {
    const notificationCards = document.querySelectorAll('.notification-card');
    const count = notificationCards.length;
    notificationCountElement.textContent = count;
    localStorage.setItem('notificationCount', count);
  }
  function loadNotificationCount() {
    const storedCount = localStorage.getItem('notificationCount');
    if (storedCount !== null) {
      notificationCountElement.textContent = storedCount;
    }
  }

  loadNotificationCount();
  populateAnomaliesTable();
  populateRequestsTable();
});

// QR Scanner controls (unchanged)
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
