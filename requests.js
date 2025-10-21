// SIDEBAR MENU
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
if (menuBar && sidebar) {
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    })
}

// SEARCH BUTTON
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

if (searchButton && searchForm && searchButtonIcon) {
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
}

// RESPONSIVE SIDEBAR
if(window.innerWidth < 768 && sidebar) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576 && searchButtonIcon && searchForm) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
	if(this.innerWidth > 576 && searchButtonIcon && searchForm) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

// DARK MODE
const switchMode = document.getElementById('switch-mode');
if (switchMode) {
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
}

// REQUESTS DATA
const requestsData = [
    { id: "REQ001", type: "Password Change", requestedBy: "John Doe", role: "Veterinarian", details: "Forgot current password", dateRequested: "2024-10-20", status: "Pending" },
    { id: "REQ002", type: "Edit Record", requestedBy: "Maria Santos", role: "Admin Assistant", details: "Update weight for LF008 - Cattle", dateRequested: "2024-10-19", status: "Approved" },
    { id: "REQ003", type: "Archive Record", requestedBy: "Carlos Reyes", role: "Supervisor", details: "Archive completed records from July", dateRequested: "2024-10-18", status: "Pending" },
    { id: "REQ004", type: "Password Change", requestedBy: "Ana Garcia", role: "Veterinarian", details: "Security update - regular password change", dateRequested: "2024-10-17", status: "Completed" },
    { id: "REQ005", type: "Edit Record", requestedBy: "Roberto Cruz", role: "Data Entry", details: "Correct anomaly description for LF003 - Swine", dateRequested: "2024-10-16", status: "Rejected" },
    { id: "REQ006", type: "Archive Record", requestedBy: "Lisa Torres", role: "Admin Assistant", details: "Archive inactive livestock records from Q2", dateRequested: "2024-10-15", status: "Pending" },
    { id: "REQ007", type: "Edit Record", requestedBy: "Miguel Fernandez", role: "Veterinarian", details: "Update health status for LF015 - Goat", dateRequested: "2024-10-14", status: "Approved" },
    { id: "REQ008", type: "Password Change", requestedBy: "Elena Rodriguez", role: "Data Entry", details: "Compromised password - immediate change needed", dateRequested: "2024-10-14", status: "Completed" },
    { id: "REQ009", type: "Archive Record", requestedBy: "Daniel Aquino", role: "Supervisor", details: "Archive deceased livestock records", dateRequested: "2024-10-13", status: "Approved" },
    { id: "REQ010", type: "Edit Record", requestedBy: "Sofia Martinez", role: "Admin Assistant", details: "Correct dealer information for LF022 - Cattle", dateRequested: "2024-10-12", status: "Pending" },
    { id: "REQ011", type: "Password Change", requestedBy: "Ramon Dela Cruz", role: "Veterinarian", details: "Monthly security password rotation", dateRequested: "2024-10-11", status: "Pending" },
    { id: "REQ012", type: "Edit Record", requestedBy: "Patricia Gomez", role: "Data Entry", details: "Update vaccination date for LF030 - Swine", dateRequested: "2024-10-10", status: "Approved" },
    { id: "REQ013", type: "Archive Record", requestedBy: "Juan Pablo Santos", role: "Admin Assistant", details: "Archive sold livestock records from September", dateRequested: "2024-10-09", status: "Completed" },
    { id: "REQ014", type: "Password Change", requestedBy: "Carmen Rivera", role: "Supervisor", details: "New device login - verification required", dateRequested: "2024-10-08", status: "Rejected" },
    { id: "REQ015", type: "Edit Record", requestedBy: "Luis Mendoza", role: "Veterinarian", details: "Add medical notes for LF045 - Carabao", dateRequested: "2024-10-07", status: "Pending" }
];

function handleRequestAction(action, requestId) {
    const item = requestsData.find(r => r.id === requestId);
    if (!item) return;

    switch(action) {
        case 'approve':
            if (confirm(`Approve request ${requestId}?`)) {
                item.status = 'Approved';
                populateRequestsTable();
            }
            break;
        case 'reject':
            if (confirm(`Reject request ${requestId}?`)) {
                item.status = 'Rejected';
                populateRequestsTable();
            }
            break;
        case 'view':
            alert(`Request Details:\n\nID: ${item.id}\nType: ${item.type}\nRequested by: ${item.requestedBy}\nRole: ${item.role}\nDetails: ${item.details}\nDate: ${item.dateRequested}\nStatus: ${item.status}`);
            break;
    }
}

function populateRequestsTable() {
    const tbody = document.querySelector("#requests-table tbody");
    if (!tbody) {
        console.error('Table tbody not found!');
        return;
    }
    
    tbody.innerHTML = "";

    requestsData.forEach((item) => {
        const tr = document.createElement("tr");
        
        let statusColor = '#333';
        switch(item.status) {
            case 'Pending': statusColor = '#ffc107'; break;
            case 'Approved': statusColor = '#28a745'; break;
            case 'Completed': statusColor = '#17a2b8'; break;
            case 'Rejected': statusColor = '#dc3545'; break;
        }
        
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.type}</td>
            <td>${item.requestedBy}</td>
            <td>${item.role}</td>
            <td>${item.details}</td>
            <td>${item.dateRequested}</td>
            <td style="color:${statusColor}; font-weight:bold;">${item.status}</td>
            <td>
                ${item.status === 'Pending' ? `
                    <button class="approve-btn" onclick="handleRequestAction('approve', '${item.id}')" style="margin-right:5px; padding:5px 10px; background:#28a745; color:white; border:none; border-radius:3px; cursor:pointer;">Approve</button>
                    <button class="reject-btn" onclick="handleRequestAction('reject', '${item.id}')" style="margin-right:5px; padding:5px 10px; background:#dc3545; color:white; border:none; border-radius:3px; cursor:pointer;">Reject</button>
                ` : ''}
                <button class="view-btn" onclick="handleRequestAction('view', '${item.id}')" style="padding:5px 10px; background:#007bff; color:white; border:none; border-radius:3px; cursor:pointer;">View</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    console.log('Populated', requestsData.length, 'requests');
}

// Make function available globally
window.handleRequestAction = handleRequestAction;

// INITIALIZE ON DOM LOAD
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('Requests.js initializing...');
    
    populateRequestsTable();
    
    // Profile image handling
    const ProfileImg = document.getElementById("profile-img");
    const NavbarProfileImg = document.getElementById("navbar-profile-img");
    const insertFile = document.getElementById("insert-file");

    function updateProfileImages(imageSrc) {
        if (ProfileImg) ProfileImg.src = imageSrc;
        if (NavbarProfileImg) NavbarProfileImg.src = imageSrc;
        localStorage.setItem('profileImage', imageSrc);
    }

    if (localStorage.getItem('profileImage')) {
        updateProfileImages(localStorage.getItem('profileImage'));
    }

    if (insertFile) {
        insertFile.onchange = function () {
            const file = insertFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updateProfileImages(e.target.result);
                }
                reader.readAsDataURL(file);
            }
        }
    }
    
    console.log('Requests.js initialized - Total requests:', requestsData.length);
}