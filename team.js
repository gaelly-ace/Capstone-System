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

// VALIDATION FUNCTIONS
function validateFullName(name) {
    const nameRegex = /^[a-zA-ZñÑ\s-]+$/;
    return nameRegex.test(name) && name.trim().length > 0;
}

function validatePassword(password) {
    return password.length > 8;
}

function validateContactNumber(number) {
    const numberRegex = /^\d{11}$/;
    return numberRegex.test(number);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
    return emailRegex.test(email);
}

function showError(inputElement, message) {
    inputElement.classList.add('error');
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorMsg = document.createElement('span');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    inputElement.parentElement.appendChild(errorMsg);
}

function clearError(inputElement) {
    inputElement.classList.remove('error');
    const errorMsg = inputElement.parentElement.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

// ADMIN DATA
let admins = [
    { id: "AD01", fullName: "John Doe", username: "johndoe@gmail.com", role: "Admin", password: "admin123456", contactNumber: "09123456789" },
    { id: "AD02", fullName: "Jane Smith", username: "janesmith@yahoo.com", role: "Admin", password: "adminpass789", contactNumber: "09187654321" },
    { id: "AD03", fullName: "Maria Santos", username: "msantos@outlook.com", role: "Admin", password: "securepass123", contactNumber: "09171234567" },
    { id: "AD04", fullName: "Carlos Reyes", username: "creyes@gmail.com", role: "Super Admin", password: "superadmin999", contactNumber: "09161234567" },
    { id: "AD05", fullName: "Ana Garcia", username: "agarcia@yahoo.com", role: "Admin", password: "anapass2024", contactNumber: "09151234567" },
    { id: "AD06", fullName: "Roberto Cruz", username: "rcruz@gmail.com", role: "Dealer", password: "dealerpass456", contactNumber: "09191234567" },
    { id: "AD07", fullName: "Lisa Torres", username: "ltorres@outlook.com", role: "Admin", password: "lisapass321", contactNumber: "09181234567" },
    { id: "AD08", fullName: "Miguel Fernandez", username: "mfernandez@gmail.com", role: "Admin", password: "miguelpass888", contactNumber: "09201234567" }
];

let archivedAdmins = [
    { id: "AD09", fullName: "Elena Rodriguez", username: "erodriguez@yahoo.com", role: "Admin", password: "oldpass123456", contactNumber: "09211234567" },
    { id: "AD10", fullName: "Daniel Aquino", username: "daquino@gmail.com", role: "Dealer", password: "dealerold456", contactNumber: "09221234567" }
];

let activityLogs = [
    { timestamp: "2025-10-21 09:15:23", adminId: "AD01", adminName: "John Doe", role: "Admin", activityType: "Login", description: "Successfully logged into the system", status: "success" },
    { timestamp: "2025-10-21 09:30:45", adminId: "AD02", adminName: "Jane Smith", role: "Admin", activityType: "Livestock Registration", description: "Registered new livestock - Cattle (ID: LV12345)", status: "success" },
    { timestamp: "2025-10-21 10:15:12", adminId: "AD01", adminName: "John Doe", role: "Admin", activityType: "Unauthorized Access", description: "Attempted to access Super Admin panel without permission", status: "error" },
    { timestamp: "2025-10-21 10:45:30", adminId: "AD03", adminName: "Maria Santos", role: "Admin", activityType: "Record Modification", description: "Modified livestock record - Swine (ID: LV12340)", status: "warning" },
    { timestamp: "2025-10-21 11:20:18", adminId: "AD04", adminName: "Carlos Reyes", role: "Super Admin", activityType: "Account Creation", description: "Created new Admin account: Ana Garcia (AD05)", status: "success" },
    { timestamp: "2025-10-21 11:55:22", adminId: "AD02", adminName: "Jane Smith", role: "Admin", activityType: "Failed Login", description: "Failed login attempt - Incorrect password", status: "error" },
    { timestamp: "2025-10-21 13:10:45", adminId: "AD05", adminName: "Ana Garcia", role: "Admin", activityType: "Livestock Registration", description: "Registered new livestock - Goat (ID: LV12346)", status: "success" },
    { timestamp: "2025-10-21 13:45:33", adminId: "AD06", adminName: "Roberto Cruz", role: "Dealer", activityType: "Report Generation", description: "Generated monthly livestock report for October 2025", status: "success" },
    { timestamp: "2025-10-21 14:20:11", adminId: "AD01", adminName: "John Doe", role: "Admin", activityType: "Unauthorized Access", description: "Attempted to access archived records without authorization", status: "error" },
    { timestamp: "2025-10-21 14:55:40", adminId: "AD07", adminName: "Lisa Torres", role: "Admin", activityType: "Record Access", description: "Viewed livestock records database - Filter: Cattle", status: "success" },
    { timestamp: "2025-10-21 15:30:15", adminId: "AD08", adminName: "Miguel Fernandez", role: "Admin", activityType: "Livestock Registration", description: "Registered new livestock - Carabao (ID: LV12347)", status: "success" },
    { timestamp: "2025-10-21 16:05:22", adminId: "AD04", adminName: "Carlos Reyes", role: "Super Admin", activityType: "Account Archive", description: "Archived account: Elena Rodriguez (AD09)", status: "warning" },
    { timestamp: "2025-10-20 08:45:30", adminId: "AD03", adminName: "Maria Santos", role: "Admin", activityType: "Record Deletion", description: "Deleted livestock record - Poultry (ID: LV12338)", status: "warning" },
    { timestamp: "2025-10-20 10:15:45", adminId: "AD06", adminName: "Roberto Cruz", role: "Dealer", activityType: "Livestock Registration", description: "Registered new livestock - Swine (ID: LV12348)", status: "success" },
    { timestamp: "2025-10-20 11:30:20", adminId: "AD02", adminName: "Jane Smith", role: "Admin", activityType: "Record Modification", description: "Updated weight for livestock - Cattle (ID: LV12345)", status: "success" },
    { timestamp: "2025-10-20 13:50:10", adminId: "AD07", adminName: "Lisa Torres", role: "Admin", activityType: "Login", description: "Successfully logged into the system", status: "success" },
    { timestamp: "2025-10-20 14:25:35", adminId: "AD05", adminName: "Ana Garcia", role: "Admin", activityType: "Record Access", description: "Viewed livestock vaccination records", status: "success" },
    { timestamp: "2025-10-20 15:40:18", adminId: "AD08", adminName: "Miguel Fernandez", role: "Admin", activityType: "Report Generation", description: "Generated health inspection report", status: "success" },
    { timestamp: "2025-10-19 09:20:45", adminId: "AD01", adminName: "John Doe", role: "Admin", activityType: "Login", description: "Successfully logged into the system", status: "success" },
    { timestamp: "2025-10-19 10:55:30", adminId: "AD04", adminName: "Carlos Reyes", role: "Super Admin", activityType: "Account Restoration", description: "Restored account: Daniel Aquino (AD10)", status: "success" },
    { timestamp: "2025-10-19 13:15:22", adminId: "AD03", adminName: "Maria Santos", role: "Admin", activityType: "Livestock Registration", description: "Registered new livestock - Cattle (ID: LV12349)", status: "success" },
    { timestamp: "2025-10-19 14:40:55", adminId: "AD06", adminName: "Roberto Cruz", role: "Dealer", activityType: "Failed Login", description: "Failed login attempt - Account locked", status: "error" },
    { timestamp: "2025-10-19 16:10:33", adminId: "AD02", adminName: "Jane Smith", role: "Admin", activityType: "Record Modification", description: "Updated dealer information for livestock LV12340", status: "success" },
    { timestamp: "2025-10-18 09:05:18", adminId: "AD07", adminName: "Lisa Torres", role: "Admin", activityType: "Record Access", description: "Exported livestock data for analysis", status: "success" },
    { timestamp: "2025-10-18 11:35:42", adminId: "AD05", adminName: "Ana Garcia", role: "Admin", activityType: "Livestock Registration", description: "Registered new livestock - Goat (ID: LV12350)", status: "success" }
];

function logActivity(adminId, adminName, role, activityType, description, status) {
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
                     String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(now.getDate()).padStart(2, '0') + ' ' + 
                     String(now.getHours()).padStart(2, '0') + ':' + 
                     String(now.getMinutes()).padStart(2, '0') + ':' + 
                     String(now.getSeconds()).padStart(2, '0');
    
    activityLogs.unshift({ timestamp, adminId, adminName, role, activityType, description, status });
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
    renderActivityLogs();
}

window.logActivity = logActivity;

function renderAdmins() {
    const tbody = document.getElementById('adminTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    admins.forEach((admin, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.fullName}</td>
            <td>${admin.username}</td>
            <td>${admin.contactNumber}</td>
            <td>${admin.role}</td>
            <td class="password-cell">
                <span class="password-value">*******</span>
                <span class="actual-password" style="display: none;">${admin.password}</span>
                <i class='bx bx-show-alt toggle-password' style="cursor:pointer;"></i>
            </td>
            <td>
                <span class="admin-delete" data-index="${index}" style="cursor:pointer; color:#dc3545;">Archive Account <i class='bx bx-archive'></i></span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const pwd = this.parentElement.querySelector('.password-value');
            const actual = this.parentElement.querySelector('.actual-password');
            if (pwd.style.display === 'none') {
                pwd.style.display = 'inline';
                actual.style.display = 'none';
                this.classList.replace('bx-hide', 'bx-show-alt');
            } else {
                pwd.style.display = 'none';
                actual.style.display = 'inline';
                this.classList.replace('bx-show-alt', 'bx-hide');
            }
        });
    });

    tbody.querySelectorAll('.admin-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            const archived = admins.splice(idx, 1)[0];
            archivedAdmins.push(archived);
            logActivity("SYSTEM", "Super Admin", "Super Admin", "Account Archive", `Archived account: ${archived.fullName} (${archived.id})`, "warning");
            renderAdmins();
            renderArchivedAdmins();
        });
    });
}

function renderArchivedAdmins() {
    const tbody = document.getElementById('archivedTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    archivedAdmins.forEach((admin, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.fullName}</td>
            <td>${admin.username}</td>
            <td>${admin.contactNumber}</td>
            <td>${admin.role}</td>
            <td class="password-cell">
                <span class="password-value">*******</span>
                <span class="actual-password" style="display: none;">${admin.password}</span>
                <i class='bx bx-show-alt toggle-password' style="cursor:pointer;"></i>
            </td>
            <td>
                <span class="admin-restore" data-index="${index}" style="cursor:pointer; color:#28a745;">Restore <i class='bx bx-undo'></i></span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const pwd = this.parentElement.querySelector('.password-value');
            const actual = this.parentElement.querySelector('.actual-password');
            if (pwd.style.display === 'none') {
                pwd.style.display = 'inline';
                actual.style.display = 'none';
                this.classList.replace('bx-hide', 'bx-show-alt');
            } else {
                pwd.style.display = 'none';
                actual.style.display = 'inline';
                this.classList.replace('bx-show-alt', 'bx-hide');
            }
        });
    });

    tbody.querySelectorAll('.admin-restore').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            const restored = archivedAdmins.splice(idx, 1)[0];
            admins.push(restored);
            logActivity("SYSTEM", "Super Admin", "Super Admin", "Account Restoration", `Restored account: ${restored.fullName} (${restored.id})`, "success");
            renderAdmins();
            renderArchivedAdmins();
        });
    });
}

function renderActivityLogs() {
    const tbody = document.getElementById('activityLogsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    activityLogs.forEach(log => {
        const statusClass = log.status === 'success' ? 'status-success' : 
                          log.status === 'warning' ? 'status-warning' : 'status-error';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${log.adminId}</td>
            <td>${log.adminName}</td>
            <td>${log.role}</td>
            <td>${log.activityType}</td>
            <td>${log.description}</td>
            <td><span class="status-badge ${statusClass}">${log.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// INITIALIZE ON DOM LOAD
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('Team.js initializing...');
    
    const saved = localStorage.getItem('activityLogs');
    if (saved) activityLogs = JSON.parse(saved);
    
    renderAdmins();
    renderArchivedAdmins();
    renderActivityLogs();
    
    const form = document.getElementById('adminForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const contactNumber = document.getElementById('contactNumber').value.trim();
            const role = document.getElementById('role').value.trim();
            
            let valid = true;
            
            if (!validateFullName(fullName)) { showError(document.getElementById('fullName'), 'Invalid name'); valid = false; }
            if (!validateEmail(username)) { showError(document.getElementById('username'), 'Invalid email'); valid = false; }
            if (!validatePassword(password)) { showError(document.getElementById('password'), 'Password too short'); valid = false; }
            if (!validateContactNumber(contactNumber)) { showError(document.getElementById('contactNumber'), 'Invalid number'); valid = false; }
            if (!role) { showError(document.getElementById('role'), 'Select role'); valid = false; }
            
            if (valid) {
                const newAdmin = {
                    id: "AD" + String(admins.length + archivedAdmins.length + 1).padStart(2, '0'),
                    fullName, username, role, password, contactNumber
                };
                admins.push(newAdmin);
                logActivity("SYSTEM", "Super Admin", "Super Admin", "Account Creation", `Created new ${role} account: ${fullName} (${newAdmin.id})`, "success");
                renderAdmins();
                form.reset();
                alert('Admin added successfully!');
            }
        });
    }
    
    console.log('Team.js initialized - Admins:', admins.length, 'Archived:', archivedAdmins.length, 'Logs:', activityLogs.length);
}