const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

// Dark Mode
const switchMode = document.getElementById('switch-mode');

// Check stored preference on page load
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    switchMode.checked = true;
}

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
    }
});

// ANOMALIES DATA - Live food reports with anomalies
const anomaliesData = [
    {
        id: "LF001",
        kind: "Pig",
        gender: "Male",
        weight: "85 kg",
        status: "Holding Pen",
        anomalies: "Skin lesions on back leg",
        reportedBy: "Dr. Santos",
        dateReported: "2024-08-05",
        severity: "Medium"
    },
    {
        id: "LF003",
        kind: "Cattle",
        gender: "Female",
        weight: "420 kg",
        status: "Slaughterhouse",
        anomalies: "Limping, swollen joints",
        reportedBy: "Vet. Cruz",
        dateReported: "2024-08-04",
        severity: "High"
    },
    {
        id: "LF007",
        kind: "Carabao",
        gender: "Male",
        weight: "480 kg",
        status: "Holding Pen",
        anomalies: "Respiratory issues, coughing",
        reportedBy: "Dr. Reyes",
        dateReported: "2024-08-03",
        severity: "High"
    },
    {
        id: "LF012",
        kind: "Pig",
        gender: "Female",
        weight: "92 kg",
        status: "Holding Pen",
        anomalies: "Loss of appetite, lethargy",
        reportedBy: "Vet. Garcia",
        dateReported: "2024-08-02",
        severity: "Medium"
    },
    {
        id: "LF015",
        kind: "Cattle",
        gender: "Male",
        weight: "510 kg",
        status: "Exit",
        anomalies: "Minor cuts from transport",
        reportedBy: "Dr. Santos",
        dateReported: "2024-08-01",
        severity: "Low"
    }
];

// REQUESTS DATA - Password changes and record edit/archive requests
const requestsData = [
    {
        id: "REQ001",
        type: "Password Change",
        requestedBy: "John Doe",
        role: "Veterinarian",
        details: "Forgot current password",
        dateRequested: "2024-08-05",
        status: "Pending"
    },
    {
        id: "REQ002",
        type: "Edit Record",
        requestedBy: "Maria Santos",
        role: "Admin Assistant",
        details: "Update weight for LF008 - Cattle",
        dateRequested: "2024-08-04",
        status: "Approved"
    },
    {
        id: "REQ003",
        type: "Archive Record",
        requestedBy: "Carlos Reyes",
        role: "Supervisor",
        details: "Archive completed records from July",
        dateRequested: "2024-08-04",
        status: "Pending"
    },
    {
        id: "REQ004",
        type: "Password Change",
        requestedBy: "Ana Garcia",
        role: "Veterinarian",
        details: "Security update - regular password change",
        dateRequested: "2024-08-03",
        status: "Completed"
    },
    {
        id: "REQ005",
        type: "Edit Record",
        requestedBy: "Roberto Cruz",
        role: "Data Entry",
        details: "Correct anomaly description for LF003",
        dateRequested: "2024-08-02",
        status: "Rejected"
    },
    {
        id: "REQ006",
        type: "Archive Record",
        requestedBy: "Lisa Torres",
        role: "Admin Assistant",
        details: "Archive inactive livestock records",
        dateRequested: "2024-08-01",
        status: "Pending"
    }
];

// Function to handle anomaly actions
function handleAnomalyAction(action, anomalyId, rowElement) {
    const dataItem = anomaliesData.find(item => item.id === anomalyId);
    if (dataItem) {
        switch(action) {
            case 'view':
                alert(`Anomaly Details:\n\nLive Food ID: ${dataItem.id}\nKind: ${dataItem.kind}\nAnomalies: ${dataItem.anomalies}\nReported by: ${dataItem.reportedBy}\nDate: ${dataItem.dateReported}\nSeverity: ${dataItem.severity}`);
                break;
            case 'resolve':
                if (confirm(`Mark anomaly for ${dataItem.kind} (${anomalyId}) as resolved?`)) {
                    rowElement.style.opacity = '0.5';
                    rowElement.style.backgroundColor = '#d4edda';
                    const actionCell = rowElement.querySelector('td:last-child');
                    actionCell.innerHTML = '<span style="color: #28a745; font-weight: bold;">Resolved</span>';
                    console.log(`Anomaly ${anomalyId} marked as resolved`);
                }
                break;
        }
    }
}

// Function to handle request actions
function handleRequestAction(action, requestId, rowElement) {
    const dataItem = requestsData.find(item => item.id === requestId);
    if (dataItem) {
        switch(action) {
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
}

// Function to populate the anomalies table
function populateAnomaliesTable() {
    const tbody = document.querySelector("#anomalies-table tbody");
    tbody.innerHTML = ""; // Clear existing rows

    anomaliesData.forEach((item) => {
        const row = document.createElement("tr");

        // Live Food ID cell
        const idCell = document.createElement("td");
        idCell.textContent = item.id;
        row.appendChild(idCell);

        // Kind of Live Food cell
        const kindCell = document.createElement("td");
        kindCell.textContent = item.kind;
        row.appendChild(kindCell);

        // Gender cell
        const genderCell = document.createElement("td");
        genderCell.textContent = item.gender;
        row.appendChild(genderCell);

        // Weight cell
        const weightCell = document.createElement("td");
        weightCell.textContent = item.weight;
        row.appendChild(weightCell);

        // Status cell
        const statusCell = document.createElement("td");
        statusCell.textContent = item.status;
        
        // Add status-based styling
        switch(item.status) {
            case 'Holding Pen':
                statusCell.style.color = '#ffc107';
                statusCell.style.fontWeight = 'bold';
                break;
            case 'Slaughterhouse':
                statusCell.style.color = '#dc3545';
                statusCell.style.fontWeight = 'bold';
                break;
            case 'Exit':
                statusCell.style.color = '#28a745';
                statusCell.style.fontWeight = 'bold';
                break;
        }
        row.appendChild(statusCell);

        // Anomalies cell
        const anomaliesCell = document.createElement("td");
        anomaliesCell.textContent = item.anomalies;
        anomaliesCell.style.color = '#dc3545';
        row.appendChild(anomaliesCell);

        // Severity cell
        const severityCell = document.createElement("td");
        severityCell.textContent = item.severity;
        
        // Add severity-based styling
        switch(item.severity) {
            case 'Low':
                severityCell.style.color = '#28a745';
                break;
            case 'Medium':
                severityCell.style.color = '#ffc107';
                break;
            case 'High':
                severityCell.style.color = '#dc3545';
                break;
        }
        severityCell.style.fontWeight = 'bold';
        row.appendChild(severityCell);

        // Action cell
        const actionCell = document.createElement("td");
        
        // View button
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("view-btn");
        viewButton.onclick = () => handleAnomalyAction('view', item.id, row);
        actionCell.appendChild(viewButton);
        
        // Resolve button
        const resolveButton = document.createElement("button");
        resolveButton.textContent = "Resolve";
        resolveButton.classList.add("resolve-btn");
        resolveButton.onclick = () => handleAnomalyAction('resolve', item.id, row);
        actionCell.appendChild(resolveButton);
        
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

// Function to populate the requests table
function populateRequestsTable() {
    const tbody = document.querySelector("#requests-table tbody");
    tbody.innerHTML = ""; // Clear existing rows

    requestsData.forEach((item) => {
        const row = document.createElement("tr");

        // Request ID cell
        const idCell = document.createElement("td");
        idCell.textContent = item.id;
        row.appendChild(idCell);

        // Type cell
        const typeCell = document.createElement("td");
        typeCell.textContent = item.type;
        row.appendChild(typeCell);

        // Requested By cell
        const requestedByCell = document.createElement("td");
        requestedByCell.textContent = item.requestedBy;
        row.appendChild(requestedByCell);

        // Role cell
        const roleCell = document.createElement("td");
        roleCell.textContent = item.role;
        row.appendChild(roleCell);

        // Details cell
        const detailsCell = document.createElement("td");
        detailsCell.textContent = item.details;
        row.appendChild(detailsCell);

        // Date cell
        const dateCell = document.createElement("td");
        dateCell.textContent = item.dateRequested;
        row.appendChild(dateCell);

        // Status cell
        const statusCell = document.createElement("td");
        statusCell.textContent = item.status;
        
        // Add status-based styling
        switch(item.status) {
            case 'Pending':
                statusCell.style.color = '#ffc107';
                break;
            case 'Approved':
                statusCell.style.color = '#28a745';
                break;
            case 'Completed':
                statusCell.style.color = '#17a2b8';
                break;
            case 'Rejected':
                statusCell.style.color = '#dc3545';
                break;
        }
        statusCell.style.fontWeight = 'bold';
        row.appendChild(statusCell);

        // Action cell
        const actionCell = document.createElement("td");
        
        if (item.status === 'Pending') {
            // Approve button
            const approveButton = document.createElement("button");
            approveButton.textContent = "Approve";
            approveButton.classList.add("approve-btn");
            approveButton.onclick = () => handleRequestAction('approve', item.id, row);
            actionCell.appendChild(approveButton);
            
            // Reject button
            const rejectButton = document.createElement("button");
            rejectButton.textContent = "Reject";
            rejectButton.classList.add("reject-btn");
            rejectButton.onclick = () => handleRequestAction('reject', item.id, row);
            actionCell.appendChild(rejectButton);
        }
        
        // View button (always available)
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.classList.add("view-btn");
        viewButton.onclick = () => handleRequestAction('view', item.id, row);
        actionCell.appendChild(viewButton);
        
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

// Initialize tables when DOM is loaded
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

    // Populate both tables
    populateAnomaliesTable();
    populateRequestsTable();
});

//Profile Image
document.addEventListener("DOMContentLoaded", function() {
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");

    // Function to update profile images
    function updateProfileImages(imageSrc) {
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
        }
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
        }
        // Update profile image in localStorage
        localStorage.setItem('profileImage', imageSrc);
    }

    // Load saved image from localStorage on page load
    if (localStorage.getItem('profileImage')) {
        let savedImageSrc = localStorage.getItem('profileImage');
        updateProfileImages(savedImageSrc);
    }

    // Handle file input change
    if (insertFile) {
        insertFile.onchange = function () {
            let file = insertFile.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let newImageSrc = e.target.result;
                    updateProfileImages(newImageSrc);
                }
                reader.readAsDataURL(file);
            }
        }
    }

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
});