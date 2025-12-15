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


// Dark Mode - Using localStorage for persistence
const switchMode = document.getElementById('switch-mode');

if (switchMode) {
	// Check stored preference on page load
	const darkModeStored = JSON.parse(localStorage.getItem('dark-mode') || 'false');
	if (darkModeStored) {
		document.body.classList.add('dark');
		switchMode.checked = true;
	}

	// Listen for changes
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

//Appointment Date ----------------------------------------------------------------
function updateDate() {
	const dateElement = document.getElementById('current-date');
	if (dateElement) {
		const now = new Date();
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		dateElement.textContent = now.toLocaleDateString(undefined, options);
	}
}

//Chart Date ----------------------------------------------------------------
function updateChartDate() {
	const dateElement = document.getElementById('current-chart');
	if (dateElement) {
		const now = new Date();
		const options = { year: 'numeric', month: 'long' };
		dateElement.textContent = now.toLocaleDateString(undefined, options);
	}
}

//Visitor Date ----------------------------------------------------------------
function updateVisitorDate() {
	const dateElement = document.getElementById('current-visitor');
	if (dateElement) {
		const now = new Date();
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		dateElement.textContent = now.toLocaleDateString(undefined, options);
	}
}

//Inquire Date ----------------------------------------------------------------
function updateInquireDate() {
	const dateElement = document.getElementById('current-inquire');
	if (dateElement) {
		const now = new Date();
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		dateElement.textContent = now.toLocaleDateString(undefined, options);
	}
}

// Combined function to update all dates
function updateDates() {
    updateDate();
    updateChartDate();
    updateVisitorDate();
    updateInquireDate();
}

//Profile - Using localStorage for persistence ------------------------------------------------------------------
function initializeProfile() {
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

        // Store in localStorage for persistence
        const profileImageData = {
            src: imageSrc,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('profileImage', JSON.stringify(profileImageData));
    }

    // Load saved profile image on page load
    const storedProfileData = localStorage.getItem('profileImage');
    if (storedProfileData) {
        try {
            const profileData = JSON.parse(storedProfileData);
            updateProfileImages(profileData.src);
        } catch (e) {
            console.error('Error loading profile image:', e);
        }
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
}


// ============================================================================
// ADMIN LIVESTOCK REQUEST SYSTEM
// ============================================================================

// Initialize Admin Request System
function initializeAdminRequestSystem() {
    // Modal Elements
    const scannerBtn = document.getElementById('scannerBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const registrationForm = document.getElementById('registrationForm');

    // Check if elements exist (they might not be on all pages)
    if (!scannerBtn || !modalOverlay || !registrationForm) {
        return; // Exit if request system elements don't exist on this page
    }

    // Form Elements
    const liveFoodInput = document.getElementById('liveFood');
    const weightInput = document.getElementById('weight');
    const weightUpBtn = document.getElementById('weightUp');
    const weightDownBtn = document.getElementById('weightDown');
    const genderButtons = document.querySelectorAll('.gender-btn');
    const genderInput = document.getElementById('gender');
    const livestockIdInput = document.getElementById('livestockId');
    const scanQrBtn = document.getElementById('scanQrBtn');
    const dealerNameInput = document.getElementById('dealerName');
    const notesInput = document.getElementById('notes');

    // QR Scanner Modal Elements
    const qrModalOverlay = document.getElementById('qrModalOverlay');
    const qrModalClose = document.getElementById('qrModalClose');
    const qrVideo = document.getElementById('qrVideo');

    // Details Modal Elements
    const detailsModalOverlay = document.getElementById('detailsModalOverlay');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const detailsContent = document.getElementById('detailsContent');

    // Status Filter
    const statusFilter = document.getElementById('statusFilter');

    // QR Scanner State
    let qrStream = null;
    let qrScanInterval = null;

    // Get current admin info (in production, get from session/auth)
    const currentAdmin = {
        id: 'admin_' + Math.random().toString(36).substr(2, 9),
        name: localStorage.getItem('adminName') || 'Admin User'
    };

    // Open Registration Modal
    scannerBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });

    // Close Registration Modal
    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        resetForm();
    });

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            resetForm();
        }
    });

    // Weight Controls
    weightUpBtn.addEventListener('click', () => {
        let currentWeight = parseFloat(weightInput.value) || 0;
        weightInput.value = (currentWeight + 0.1).toFixed(1);
    });

    weightDownBtn.addEventListener('click', () => {
        let currentWeight = parseFloat(weightInput.value) || 0;
        if (currentWeight > 0) {
            weightInput.value = (currentWeight - 0.1).toFixed(1);
        }
    });

    // Gender Selection
    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            genderInput.value = btn.dataset.gender;
        });
    });

    // Open QR Scanner Modal
    scanQrBtn.addEventListener('click', () => {
        qrModalOverlay.classList.add('active');
        startQRScanner();
    });

    // Close QR Scanner Modal
    qrModalClose.addEventListener('click', () => {
        qrModalOverlay.classList.remove('active');
        stopQRScanner();
    });

    qrModalOverlay.addEventListener('click', (e) => {
        if (e.target === qrModalOverlay) {
            qrModalOverlay.classList.remove('active');
            stopQRScanner();
        }
    });

    // Close Details Modal
    if (detailsModalClose) {
        detailsModalClose.addEventListener('click', () => {
            detailsModalOverlay.classList.remove('active');
        });

        detailsModalOverlay.addEventListener('click', (e) => {
            if (e.target === detailsModalOverlay) {
                detailsModalOverlay.classList.remove('active');
            }
        });
    }

    // Status Filter
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            loadSubmissions();
        });
    }

    // Start QR Scanner
    async function startQRScanner() {
        try {
            qrStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            qrVideo.srcObject = qrStream;
            
            // Simulate QR code scanning (in production, use a QR library like jsQR)
            qrScanInterval = setInterval(() => {
                // For demo purposes, we'll generate a random ID after 2 seconds
                // In production, implement actual QR code detection here
            }, 100);

            // Simulate successful scan after 2 seconds for demo
            setTimeout(() => {
                simulateQRScan();
            }, 2000);
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure camera permissions are granted.');
            qrModalOverlay.classList.remove('active');
        }
    }

    // Stop QR Scanner
    function stopQRScanner() {
        if (qrStream) {
            qrStream.getTracks().forEach(track => track.stop());
            qrStream = null;
        }
        if (qrScanInterval) {
            clearInterval(qrScanInterval);
            qrScanInterval = null;
        }
    }

    // Simulate QR Scan (Replace with actual QR detection in production)
    function simulateQRScan() {
        // Generate random 10-digit ID
        const randomId = 'LV-' + String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');
        livestockIdInput.value = randomId;
        
        // Close QR scanner modal
        qrModalOverlay.classList.remove('active');
        stopQRScanner();
        
        // Show success feedback
        livestockIdInput.style.borderColor = '#4CAF50';
        setTimeout(() => {
            livestockIdInput.style.borderColor = '';
        }, 1500);
    }

    // Form Submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        if (!liveFoodInput.value || !weightInput.value || !genderInput.value || 
            !livestockIdInput.value || !dealerNameInput.value) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Get existing requests from localStorage
        let livestockRequests = JSON.parse(localStorage.getItem('livestockRequests')) || [];
        
        // Create new livestock request
        const now = new Date();
        const request = {
            requestId: 'REQ-' + Date.now(),
            livestockId: livestockIdInput.value,
            kindOfLivestock: liveFoodInput.value,
            gender: genderInput.value,
            weight: parseFloat(weightInput.value),
            dealer: dealerNameInput.value,
            notes: notesInput.value || '',
            status: 'pending', // pending, approved, rejected
            submittedBy: currentAdmin.name,
            submittedById: currentAdmin.id,
            submittedDate: now.toISOString(),
            lastModified: now.toISOString(),
            reviewedBy: null,
            reviewedDate: null,
            reviewNotes: null
        };
        
        // Check for duplicate Livestock ID
        const existingRequest = livestockRequests.find(r => r.livestockId === request.livestockId);
        if (existingRequest) {
            alert('A request with this Livestock ID already exists!');
            return;
        }
        
        // Add to localStorage
        livestockRequests.push(request);
        localStorage.setItem('livestockRequests', JSON.stringify(livestockRequests));
        
        // Show success message
        showNotification('Request submitted successfully! Waiting for SuperAdmin approval.', 'success');
        
        // Reload submissions table
        loadSubmissions();
        
        // Close modal and reset form
        modalOverlay.classList.remove('active');
        resetForm();
    });

    // Load Submissions
    function loadSubmissions() {
        const tbody = document.getElementById('submissions-tbody');
        const emptyState = document.getElementById('emptyState');
        
        if (!tbody) return;
        
        // Get all requests
        let allRequests = JSON.parse(localStorage.getItem('livestockRequests')) || [];
        
        // Filter by current admin
        let myRequests = allRequests.filter(r => r.submittedById === currentAdmin.id);
        
        // Apply status filter
        const filterValue = statusFilter ? statusFilter.value : 'all';
        if (filterValue !== 'all') {
            myRequests = myRequests.filter(r => r.status === filterValue);
        }
        
        // Sort by date (newest first)
        myRequests.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
        
        // Clear table
        tbody.innerHTML = '';
        
        // Show empty state if no submissions
        if (myRequests.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }
        
        // Add each request to table
        myRequests.forEach(request => {
            const row = createSubmissionRow(request);
            tbody.appendChild(row);
        });
    }

    // Create Submission Row
    function createSubmissionRow(request) {
        const row = document.createElement('tr');
        
        const submittedDate = new Date(request.submittedDate);
        const dateStr = submittedDate.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
        const timeStr = submittedDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Status class mapping
        const statusClass = {
            'pending': 'pending',
            'approved': 'approved',
            'rejected': 'rejected'
        }[request.status] || 'pending';
        
        const statusText = {
            'pending': 'Pending Review',
            'approved': 'Approved',
            'rejected': 'Rejected'
        }[request.status] || 'Pending';
        
        row.innerHTML = `
            <td><p>${request.kindOfLivestock}</p></td>
            <td>${request.dealer}</td>
            <td>${request.weight} kg</td>
            <td>
                <div>${dateStr}</div>
                <small style="color: var(--dark-grey); font-size: 11px;">${timeStr}</small>
            </td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn view" onclick="viewRequestDetails('${request.requestId}')">
                    <i class='bx bx-show'></i> View
                </button>
                ${request.status === 'pending' ? `
                    <button class="action-btn delete" onclick="deleteRequest('${request.requestId}')">
                        <i class='bx bx-trash'></i> Delete
                    </button>
                ` : ''}
            </td>
        `;
        
        // Add animation
        row.style.animation = 'slideIn 0.5s ease';
        
        return row;
    }

    // Make functions globally accessible
    window.viewRequestDetails = function(requestId) {
        const requests = JSON.parse(localStorage.getItem('livestockRequests')) || [];
        const request = requests.find(r => r.requestId === requestId);
        
        if (!request) return;
        
        const submittedDate = new Date(request.submittedDate);
        const dateStr = submittedDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let reviewInfo = '';
        if (request.status !== 'pending' && request.reviewedDate) {
            const reviewedDate = new Date(request.reviewedDate);
            const reviewDateStr = reviewedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            reviewInfo = `
                <div class="detail-item">
                    <span class="detail-label">Reviewed By:</span>
                    <span class="detail-value">${request.reviewedBy || 'SuperAdmin'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Reviewed Date:</span>
                    <span class="detail-value">${reviewDateStr}</span>
                </div>
                ${request.reviewNotes ? `
                    <div class="detail-item" style="flex-direction: column; align-items: flex-start;">
                        <span class="detail-label">Review Notes:</span>
                        <span class="detail-value" style="margin-top: 8px; text-align: left;">${request.reviewNotes}</span>
                    </div>
                ` : ''}
            `;
        }
        
        detailsContent.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Request ID:</span>
                <span class="detail-value">${request.requestId}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Livestock ID:</span>
                <span class="detail-value">${request.livestockId}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Kind:</span>
                <span class="detail-value">${request.kindOfLivestock}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Gender:</span>
                <span class="detail-value">${request.gender.charAt(0).toUpperCase() + request.gender.slice(1)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Weight:</span>
                <span class="detail-value">${request.weight} kg</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dealer:</span>
                <span class="detail-value">${request.dealer}</span>
            </div>
            ${request.notes ? `
                <div class="detail-item" style="flex-direction: column; align-items: flex-start;">
                    <span class="detail-label">Notes:</span>
                    <span class="detail-value" style="margin-top: 8px; text-align: left;">${request.notes}</span>
                </div>
            ` : ''}
            <div class="detail-item">
                <span class="detail-label">Submitted:</span>
                <span class="detail-value">${dateStr}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value">
                    <span class="status ${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                </span>
            </div>
            ${reviewInfo}
        `;
        
        detailsModalOverlay.classList.add('active');
    };

    window.deleteRequest = function(requestId) {
        if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
            return;
        }
        
        let requests = JSON.parse(localStorage.getItem('livestockRequests')) || [];
        requests = requests.filter(r => r.requestId !== requestId);
        localStorage.setItem('livestockRequests', JSON.stringify(requests));
        
        showNotification('Request deleted successfully', 'success');
        loadSubmissions();
    };

    // Reset Form
    function resetForm() {
        registrationForm.reset();
        genderButtons.forEach(btn => btn.classList.remove('active'));
        genderInput.value = '';
        livestockIdInput.value = '';
        weightInput.value = '0.0';
        if (notesInput) notesInput.value = '';
    }

    // Show Notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-info-circle'}'></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initial load
    loadSubmissions();
}

// ============================================================================
// INITIALIZE ALL FUNCTIONS WHEN PAGE LOADS
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Update all dates
    updateDates();
    
    // Initialize profile functionality
    initializeProfile();
    
    // Initialize admin request system
    initializeAdminRequestSystem();
});