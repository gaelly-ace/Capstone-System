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


// Dark Mode - Using in-memory state instead of localStorage
const switchMode = document.getElementById('switch-mode');

// Initialize dark mode state in memory
let darkModeEnabled = false;

if (switchMode) {
	switchMode.addEventListener('change', function () {
		if (this.checked) {
			document.body.classList.add('dark');
			darkModeEnabled = true;
		} else {
			document.body.classList.remove('dark');
			darkModeEnabled = false;
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

//Profile - Using in-memory state instead of localStorage ------------------------------------------------------------------
function initializeProfile() {
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");

    // Store profile image in memory
    let profileImageSrc = '';

    function updateProfileImages(imageSrc) {
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
        }
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
        }

        // Store in memory only
        profileImageSrc = imageSrc;
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
// LIVESTOCK REGISTRATION SYSTEM
// ============================================================================

// In-memory storage for livestock records
let livestockRecords = [];

// Initialize Livestock Registration System
function initializeLivestockSystem() {
    // Modal Elements
    const scannerBtn = document.getElementById('scannerBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const registrationForm = document.getElementById('registrationForm');

    // Check if elements exist (they might not be on all pages)
    if (!scannerBtn || !modalOverlay || !registrationForm) {
        return; // Exit if livestock system elements don't exist on this page
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

    // QR Scanner Modal Elements
    const qrModalOverlay = document.getElementById('qrModalOverlay');
    const qrModalClose = document.getElementById('qrModalClose');
    const qrVideo = document.getElementById('qrVideo');

    // QR Scanner State
    let qrStream = null;
    let qrScanInterval = null;

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
        const randomId = String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');
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
            alert('Please fill in all fields');
            return;
        }
        
        // Create new livestock record
        const now = new Date();
        const record = {
            liveFood: liveFoodInput.value,
            weight: parseFloat(weightInput.value),
            gender: genderInput.value,
            id: livestockIdInput.value,
            dealer: dealerNameInput.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            status: 'In Holding Pen'
        };
        
        // Add to memory storage
        livestockRecords.unshift(record);
        
        // Add to table
        addRecordToTable(record);
        
        // Show success message
        alert('Livestock registered successfully!');
        
        // Close modal and reset form
        modalOverlay.classList.remove('active');
        resetForm();
    });

    // Add Record to Table
    function addRecordToTable(record) {
        const tbody = document.getElementById('records-tbody');
        if (!tbody) return; // Exit if table doesn't exist on this page
        
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td><p>${record.liveFood}</p></td>
            <td>${record.dealer}</td>
            <td>${record.time}</td>
            <td>${record.date}</td>
            <td><span class="status pending">${record.status}</span></td>
            <td>${record.weight} kg</td>
        `;
        
        // Add animation
        newRow.style.animation = 'slideIn 0.5s ease';
        tbody.insertBefore(newRow, tbody.firstChild);
    }

    // Reset Form
    function resetForm() {
        registrationForm.reset();
        genderButtons.forEach(btn => btn.classList.remove('active'));
        genderInput.value = '';
        livestockIdInput.value = '';
        weightInput.value = '0.0';
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// INITIALIZE ALL FUNCTIONS WHEN PAGE LOADS
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Update all dates
    updateDates();
    
    // Initialize profile functionality
    initializeProfile();
    
    // Initialize livestock registration system
    initializeLivestockSystem();
});