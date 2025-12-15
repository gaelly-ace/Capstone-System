// ============================================================================
// ADMIN ANOMALY REPORTS SYSTEM
// ============================================================================

// Get current admin info (in production, get from session/auth)
const currentAdmin = {
    id: localStorage.getItem('adminId') || 'admin_' + Math.random().toString(36).substr(2, 9),
    name: localStorage.getItem('adminName') || 'Admin User'
};

// Save admin ID for persistence
if (!localStorage.getItem('adminId')) {
    localStorage.setItem('adminId', currentAdmin.id);
}

// Modal Elements
const submitReportBtn = document.getElementById('submitReportBtn');
const reportModalOverlay = document.getElementById('reportModalOverlay');
const reportModalClose = document.getElementById('reportModalClose');
const reportForm = document.getElementById('reportForm');

// Form Elements
const livestockIdInput = document.getElementById('livestockId');
const liveFoodInput = document.getElementById('liveFood');
const weightInput = document.getElementById('weight');
const weightUpBtn = document.getElementById('weightUp');
const weightDownBtn = document.getElementById('weightDown');
const genderButtons = document.querySelectorAll('.gender-btn');
const genderInput = document.getElementById('gender');
const statusSelect = document.getElementById('status');
const anomalyDescInput = document.getElementById('anomalyDescription');
const notesInput = document.getElementById('notes');
const scanQrBtn = document.getElementById('scanQrBtn');

// QR Scanner Modal Elements
const qrModalOverlay = document.getElementById('qrModalOverlay');
const qrModalClose = document.getElementById('qrModalClose');
const qrVideo = document.getElementById('qrVideo');

// Details Modal Elements
const detailsModalOverlay = document.getElementById('detailsModalOverlay');
const detailsModalClose = document.getElementById('detailsModalClose');
const detailsContent = document.getElementById('detailsContent');

// Filter
const statusFilter = document.getElementById('statusFilter');

// QR Scanner State
let qrStream = null;

// ============================================================================
// MODAL HANDLERS
// ============================================================================

// Open Report Modal
if (submitReportBtn) {
    submitReportBtn.addEventListener('click', () => {
        reportModalOverlay.classList.add('active');
    });
}

// Close Report Modal
if (reportModalClose) {
    reportModalClose.addEventListener('click', () => {
        reportModalOverlay.classList.remove('active');
        resetReportForm();
    });
}

if (reportModalOverlay) {
    reportModalOverlay.addEventListener('click', (e) => {
        if (e.target === reportModalOverlay) {
            reportModalOverlay.classList.remove('active');
            resetReportForm();
        }
    });
}

// Close Details Modal
if (detailsModalClose) {
    detailsModalClose.addEventListener('click', () => {
        detailsModalOverlay.classList.remove('active');
    });
}

if (detailsModalOverlay) {
    detailsModalOverlay.addEventListener('click', (e) => {
        if (e.target === detailsModalOverlay) {
            detailsModalOverlay.classList.remove('active');
        }
    });
}

// ============================================================================
// FORM CONTROLS
// ============================================================================

// Weight Controls
if (weightUpBtn && weightInput) {
    weightUpBtn.addEventListener('click', () => {
        let currentWeight = parseFloat(weightInput.value) || 0;
        weightInput.value = (currentWeight + 0.1).toFixed(1);
    });
}

if (weightDownBtn && weightInput) {
    weightDownBtn.addEventListener('click', () => {
        let currentWeight = parseFloat(weightInput.value) || 0;
        if (currentWeight > 0) {
            weightInput.value = (currentWeight - 0.1).toFixed(1);
        }
    });
}

// Gender Selection
genderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        genderButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (genderInput) genderInput.value = btn.dataset.gender;
    });
});

// ============================================================================
// QR SCANNER
// ============================================================================

if (scanQrBtn && qrModalOverlay) {
    scanQrBtn.addEventListener('click', () => {
        qrModalOverlay.classList.add('active');
        startQRScanner();
    });
}

if (qrModalClose && qrModalOverlay) {
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
}

async function startQRScanner() {
    try {
        qrStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        qrVideo.srcObject = qrStream;
        
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

function stopQRScanner() {
    if (qrStream) {
        qrStream.getTracks().forEach(track => track.stop());
        qrStream = null;
    }
}

function simulateQRScan() {
    // Generate random livestock ID
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

// ============================================================================
// FORM SUBMISSION
// ============================================================================

if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all required fields
        if (!livestockIdInput.value || !liveFoodInput.value || !genderInput.value || 
            !weightInput.value || !statusSelect.value || !anomalyDescInput.value) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Get existing reports from localStorage
        let anomalyReports = JSON.parse(localStorage.getItem('anomalyReports')) || [];
        
        // Create new report
        const now = new Date();
        const report = {
            reportId: 'RPT-' + Date.now(),
            livestockId: livestockIdInput.value,
            kindOfLivestock: liveFoodInput.value,
            gender: genderInput.value,
            weight: parseFloat(weightInput.value),
            status: statusSelect.value,
            anomalyDescription: anomalyDescInput.value,
            notes: notesInput.value || '',
            reportStatus: 'pending', // pending, resolved, rejected
            submittedBy: currentAdmin.name,
            submittedById: currentAdmin.id,
            submittedDate: now.toISOString(),
            lastModified: now.toISOString(),
            reviewedBy: null,
            reviewedDate: null,
            reviewNotes: null
        };
        
        // Add to localStorage
        anomalyReports.push(report);
        localStorage.setItem('anomalyReports', JSON.stringify(anomalyReports));
        
        // Show success message
        showNotification('Anomaly report submitted successfully! Waiting for SuperAdmin review.', 'success');
        
        // Reload reports table
        loadReports();
        
        // Close modal and reset form
        reportModalOverlay.classList.remove('active');
        resetReportForm();
    });
}

// ============================================================================
// LOAD REPORTS
// ============================================================================

function loadReports() {
    const tbody = document.getElementById('reports-tbody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tbody) return;
    
    // Get all reports
    let allReports = JSON.parse(localStorage.getItem('anomalyReports')) || [];
    
    // Filter by current admin
    let myReports = allReports.filter(r => r.submittedById === currentAdmin.id);
    
    // Apply status filter
    const filterValue = statusFilter ? statusFilter.value : 'all';
    if (filterValue !== 'all') {
        myReports = myReports.filter(r => r.reportStatus === filterValue);
    }
    
    // Sort by date (newest first)
    myReports.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
    
    // Clear table
    tbody.innerHTML = '';
    
    // Show empty state if no reports
    if (myReports.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }
    
    // Add each report to table
    myReports.forEach(report => {
        const row = createReportRow(report);
        tbody.appendChild(row);
    });
}

// ============================================================================
// CREATE REPORT ROW
// ============================================================================

function createReportRow(report) {
    const row = document.createElement('tr');
    
    const submittedDate = new Date(report.submittedDate);
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
        'resolved': 'resolved',
        'rejected': 'rejected'
    }[report.reportStatus] || 'pending';
    
    const statusText = {
        'pending': 'Pending',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    }[report.reportStatus] || 'Pending';
    
    // Truncate anomaly description for table
    const shortAnomaly = report.anomalyDescription.length > 50 
        ? report.anomalyDescription.substring(0, 50) + '...' 
        : report.anomalyDescription;
    
    row.innerHTML = `
        <td><strong>${report.reportId}</strong></td>
        <td>${report.livestockId}</td>
        <td>${report.kindOfLivestock}</td>
        <td>${shortAnomaly}</td>
        <td>
            <div>${dateStr}</div>
            <small style="color: var(--dark-grey); font-size: 11px;">${timeStr}</small>
        </td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <button class="view-btn" onclick="viewReportDetails('${report.reportId}')">
                <i class='bx bx-show'></i> View
            </button>
            ${report.reportStatus === 'pending' ? `
                <button class="delete-btn" onclick="deleteReport('${report.reportId}')">
                    <i class='bx bx-trash'></i> Delete
                </button>
            ` : ''}
        </td>
    `;
    
    // Add animation
    row.style.animation = 'slideIn 0.5s ease';
    
    return row;
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
// GLOBAL FUNCTIONS
// ============================================================================

window.viewReportDetails = function(reportId) {
    const reports = JSON.parse(localStorage.getItem('anomalyReports')) || [];
    const report = reports.find(r => r.reportId === reportId);
    
    if (!report) return;
    
    const submittedDate = new Date(report.submittedDate);
    const dateStr = submittedDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let reviewInfo = '';
    if (report.reportStatus !== 'pending' && report.reviewedDate) {
        const reviewedDate = new Date(report.reviewedDate);
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
                <span class="detail-value">${report.reviewedBy || 'SuperAdmin'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Reviewed Date:</span>
                <span class="detail-value">${reviewDateStr}</span>
            </div>
            ${report.reviewNotes ? `
                <div class="detail-item" style="flex-direction: column; align-items: flex-start;">
                    <span class="detail-label">Review Notes:</span>
                    <span class="detail-value" style="margin-top: 8px; text-align: left;">${report.reviewNotes}</span>
                </div>
            ` : ''}
        `;
    }
    
    detailsContent.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">Report ID:</span>
            <span class="detail-value">${report.reportId}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Livestock ID:</span>
            <span class="detail-value">${report.livestockId}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Kind:</span>
            <span class="detail-value">${report.kindOfLivestock}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Gender:</span>
            <span class="detail-value">${report.gender.charAt(0).toUpperCase() + report.gender.slice(1)}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Weight:</span>
            <span class="detail-value">${report.weight} kg</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Location/Status:</span>
            <span class="detail-value">${report.status}</span>
        </div>
        <div class="detail-item" style="flex-direction: column; align-items: flex-start;">
            <span class="detail-label">Anomaly Description:</span>
            <span class="detail-value" style="margin-top: 8px; text-align: left;">${report.anomalyDescription}</span>
        </div>
        ${report.notes ? `
            <div class="detail-item" style="flex-direction: column; align-items: flex-start;">
                <span class="detail-label">Additional Notes:</span>
                <span class="detail-value" style="margin-top: 8px; text-align: left;">${report.notes}</span>
            </div>
        ` : ''}
        <div class="detail-item">
            <span class="detail-label">Submitted:</span>
            <span class="detail-value">${dateStr}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Report Status:</span>
            <span class="detail-value">
                <span class="status-badge ${report.reportStatus}">${report.reportStatus.charAt(0).toUpperCase() + report.reportStatus.slice(1)}</span>
            </span>
        </div>
        ${reviewInfo}
    `;
    
    detailsModalOverlay.classList.add('active');
};

window.deleteReport = function(reportId) {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
        return;
    }
    
    let reports = JSON.parse(localStorage.getItem('anomalyReports')) || [];
    reports = reports.filter(r => r.reportId !== reportId);
    localStorage.setItem('anomalyReports', JSON.stringify(reports));
    
    showNotification('Report deleted successfully', 'success');
    loadReports();
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function resetReportForm() {
    if (reportForm) reportForm.reset();
    genderButtons.forEach(btn => btn.classList.remove('active'));
    if (genderInput) genderInput.value = '';
    if (livestockIdInput) livestockIdInput.value = '';
    if (weightInput) weightInput.value = '0.0';
    if (anomalyDescInput) anomalyDescInput.value = '';
    if (notesInput) notesInput.value = '';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-info-circle'}'></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================================
// STATUS FILTER
// ============================================================================

if (statusFilter) {
    statusFilter.addEventListener('change', () => {
        loadReports();
    });
}

// ============================================================================
// INITIALIZE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadReports();
});