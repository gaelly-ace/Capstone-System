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
        id: "123",
        kind: "Swine",
        time: "10:00",
        gender: "Male",
        weight: "200kg",
        status: "Holding Pen",
        anomalies: "none"
    },
    {
        id: "124",
        kind: "Cattle",
        time: "10:15",
        gender: "Female",
        weight: "420kg",
        status: "Slaughterhouse",
        anomalies: "Limping, swollen joints"
    },
    {
        id: "125",
        kind: "Carabao",
        time: "10:30",
        gender: "Male",
        weight: "480kg",
        status: "Holding Pen",
        anomalies: "Respiratory issues"
    },
    {
        id: "126",
        kind: "Swine",
        time: "11:00",
        gender: "Female",
        weight: "92kg",
        status: "Holding Pen",
        anomalies: "Loss of appetite"
    },
    {
        id: "127",
        kind: "Cattle",
        time: "11:20",
        gender: "Male",
        weight: "510kg",
        status: "Exit",
        anomalies: "none"
    }
];

// Function to handle anomaly actions
function handleAnomalyAction(action, anomalyId, rowElement) {
    const dataItem = anomaliesData.find(item => item.id === anomalyId);
    if (dataItem) {
        switch(action) {
            case 'view':
                alert(`Anomaly Details:\n\nLive Food ID: ${dataItem.id}\nKind: ${dataItem.kind}\nTime: ${dataItem.time}\nGender: ${dataItem.gender}\nWeight: ${dataItem.weight}\nStatus: ${dataItem.status}\nAnomalies: ${dataItem.anomalies}`);
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

// Function to populate the anomalies table
function populateAnomaliesTable() {
    const tbody = document.querySelector("#anomalies-table tbody");
    tbody.innerHTML = "";

    anomaliesData.forEach((item) => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = item.id;
        row.appendChild(idCell);

        const kindCell = document.createElement("td");
        kindCell.textContent = item.kind;
        row.appendChild(kindCell);

        const timeCell = document.createElement("td");
        timeCell.textContent = item.time;
        row.appendChild(timeCell);

        const genderCell = document.createElement("td");
        genderCell.textContent = item.gender;
        row.appendChild(genderCell);

        const weightCell = document.createElement("td");
        weightCell.textContent = item.weight;
        row.appendChild(weightCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = item.status;
        
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

        const anomaliesCell = document.createElement("td");
        anomaliesCell.textContent = item.anomalies;
        if (item.anomalies !== 'none') {
            anomaliesCell.style.color = '#dc3545';
        }
        row.appendChild(anomaliesCell);

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
    populateAnomaliesTable();
});

//Profile Image
document.addEventListener("DOMContentLoaded", function() {
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");

    function updateProfileImages(imageSrc) {
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
        }
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
        }
        localStorage.setItem('profileImage', imageSrc);
    }

    if (localStorage.getItem('profileImage')) {
        let savedImageSrc = localStorage.getItem('profileImage');
        updateProfileImages(savedImageSrc);
    }

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

    window.startQrScanner = startQrScanner;
    window.stopQrScanner = stopQrScanner;
});