// ============================================================================
// ADMIN ARCHIVE RESTORATION REQUEST SYSTEM
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ADMIN ARCHIVE.JS STARTING ===');

    // Get current admin info (in production, get from session/auth)
    const currentAdmin = {
        id: localStorage.getItem('adminId') || 'admin_' + Math.random().toString(36).substr(2, 9),
        name: localStorage.getItem('adminName') || 'Admin User'
    };

    // Save admin ID for persistence
    if (!localStorage.getItem('adminId')) {
        localStorage.setItem('adminId', currentAdmin.id);
    }

    // Helper functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');
        return `${strHours}:${minutes}:${seconds} ${ampm}`;
    }

    // Initialize sample archived records
    function initializeSampleArchives() {
        let archivedRecords = JSON.parse(localStorage.getItem('archivedLivestockRecords'));
        
        if (!archivedRecords || archivedRecords.length === 0) {
            const sampleArchives = [
                {
                    livestockId: "LV-2024-001",
                    kindOfLivestock: "Pig",
                    gender: "Male",
                    weight: 85.5,
                    dealerName: "Juan Dela Cruz Farm",
                    status: "Sold",
                    createdDate: new Date('2024-01-15T08:30:00').toISOString(),
                    archivedDate: new Date('2024-10-10T14:20:00').toISOString()
                },
                {
                    livestockId: "LV-2024-002",
                    kindOfLivestock: "Cattle",
                    gender: "Female",
                    weight: 320.0,
                    dealerName: "Maria Santos Livestock",
                    status: "Deceased",
                    createdDate: new Date('2024-02-20T10:15:00').toISOString(),
                    archivedDate: new Date('2024-10-12T09:45:00').toISOString()
                },
                {
                    livestockId: "LV-2024-003",
                    kindOfLivestock: "Carabao",
                    gender: "Male",
                    weight: 450.5,
                    dealerName: "Pedro Reyes Trading",
                    status: "Transferred",
                    createdDate: new Date('2024-03-10T07:00:00').toISOString(),
                    archivedDate: new Date('2024-10-15T11:30:00').toISOString()
                },
                {
                    livestockId: "LV-2024-004",
                    kindOfLivestock: "Goat",
                    gender: "Female",
                    weight: 35.2,
                    dealerName: "Ana Garcia Farm Supply",
                    status: "Sold",
                    createdDate: new Date('2024-04-05T13:45:00').toISOString(),
                    archivedDate: new Date('2024-10-16T16:00:00').toISOString()
                },
                {
                    livestockId: "LV-2024-005",
                    kindOfLivestock: "Pig",
                    gender: "Female",
                    weight: 92.8,
                    dealerName: "Roberto Cruz Enterprises",
                    status: "Sold",
                    createdDate: new Date('2024-05-12T09:20:00').toISOString(),
                    archivedDate: new Date('2024-10-17T10:15:00').toISOString()
                },
                {
                    livestockId: "LV-2024-006",
                    kindOfLivestock: "Cattle",
                    gender: "Male",
                    weight: 380.0,
                    dealerName: "Carmen Lopez Trading",
                    status: "Sold",
                    createdDate: new Date('2024-06-08T11:30:00').toISOString(),
                    archivedDate: new Date('2024-10-18T13:40:00').toISOString()
                }
            ];
            
            localStorage.setItem('archivedLivestockRecords', JSON.stringify(sampleArchives));
            console.log('Initialized', sampleArchives.length, 'sample archived records');
        }
    }

    // Initialize sample archives first
    initializeSampleArchives();

    // Get DOM elements
    const entries = document.querySelector(".showEntries");
    const tabSize = document.getElementById("table_size");
    const userInfo = document.querySelector(".userInfo");
    const filterData = document.getElementById("search");

    // Modal elements
    const restorationModalOverlay = document.getElementById('restorationModalOverlay');
    const restorationModalClose = document.getElementById('restorationModalClose');
    const restorationForm = document.getElementById('restorationForm');
    const modalLivestockId = document.getElementById('modalLivestockId');
    const modalKind = document.getElementById('modalKind');
    const modalDealer = document.getElementById('modalDealer');
    const modalArchivedDate = document.getElementById('modalArchivedDate');
    const restorationReason = document.getElementById('restorationReason');
    const restorationNotes = document.getElementById('restorationNotes');

    // Get archived data from localStorage
    let originalData = JSON.parse(localStorage.getItem('archivedLivestockRecords')) || [];
    let getData = [...originalData];

    console.log('Loaded', originalData.length, 'archived records');

    let currentRecord = null;
    let arrayLength = 0;
    let tableSize = 10;
    let startIndex = 1;
    let endIndex = 0;
    let currentIndex = 1;
    let maxIndex = 0;

    function preLoadCalculations() {
        arrayLength = getData.length;
        maxIndex = Math.ceil(arrayLength / tableSize);
    }

    function displayIndexBtn() {
        preLoadCalculations();
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        pagination.innerHTML = '';
        pagination.innerHTML += `<button onclick="prev()" class="prev">Prev</button>`;

        for (let i = 1; i <= maxIndex; i++) {
            pagination.innerHTML += `<button onclick="paginationBtn(${i})" index="${i}">${i}</button>`;
        }

        pagination.innerHTML += `<button onclick="next()" class="next">Next</button>`;
        highlightIndexBtn();
    }

    function highlightIndexBtn() {
        startIndex = ((currentIndex - 1) * tableSize) + 1;
        endIndex = startIndex + tableSize - 1;

        if (endIndex > arrayLength) {
            endIndex = arrayLength;
        }

        if (entries) {
            if (arrayLength === 0) {
                entries.textContent = `Showing 0 to 0 of 0 entries`;
            } else {
                entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;
            }
        }

        const paginationBtns = document.querySelectorAll('.pagination button');
        paginationBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('index') == currentIndex) {
                btn.classList.add('active');
            }
        });

        const prevBtn = document.querySelector('.pagination .prev');
        const nextBtn = document.querySelector('.pagination .next');
        
        if (prevBtn && nextBtn) {
            if (currentIndex <= 1) {
                prevBtn.classList.remove('act');
            } else {
                prevBtn.classList.add('act');
            }

            if (currentIndex >= maxIndex) {
                nextBtn.classList.remove('act');
            } else {
                nextBtn.classList.add('act');
            }
        }

        showInfo();
    }

    function showInfo() {
        if (!userInfo) return;
        userInfo.innerHTML = '';

        let tab_start = startIndex - 1;
        let tab_end = endIndex;

        if (getData.length > 0) {
            for (let i = tab_start; i < tab_end; i++) {
                const record = getData[i];
                if (record) {
                    const createdDate = record.createdDate ? formatDate(record.createdDate) : 'N/A';
                    const createdTime = record.createdDate ? formatTime(record.createdDate) : 'N/A';
                    const archivedDate = record.archivedDate ? formatDate(record.archivedDate) : 'N/A';
                    const dealerName = record.dealerName || 'N/A';
                    
                    let createElement = `
                        <tr class="recordDetails">
                            <td>${record.livestockId}</td>
                            <td>${record.kindOfLivestock}</td>
                            <td>${record.gender}</td>
                            <td>${record.weight} kg</td>
                            <td>${dealerName}</td>
                            <td>${record.status}</td>
                            <td>${createdDate}</td>
                            <td>${createdTime}</td>
                            <td class="archived-date">${archivedDate}</td>
                            <td>
                                <button onclick="window.archiveApp.openRestorationRequest('${record.livestockId}')" class="restoreBtn">Request Restore</button>
                            </td>
                        </tr>`;
                    userInfo.innerHTML += createElement;
                }
            }
        } else {
            userInfo.innerHTML = `<tr class="recordDetails"><td class="empty" colspan="10" align="center">No archived records available</td></tr>`;
        }
        
        console.log('Displaying records', tab_start + 1, 'to', tab_end);
    }

    // ============================================================================
    // RESTORATION REQUEST FUNCTIONS
    // ============================================================================

    function openRestorationRequest(livestockId) {
        const record = originalData.find(r => r.livestockId === livestockId);
        if (!record) {
            alert('Record not found!');
            return;
        }

        currentRecord = record;

        // Populate modal with record details
        if (modalLivestockId) modalLivestockId.textContent = record.livestockId;
        if (modalKind) modalKind.textContent = record.kindOfLivestock;
        if (modalDealer) modalDealer.textContent = record.dealerName || 'N/A';
        if (modalArchivedDate) modalArchivedDate.textContent = record.archivedDate ? formatDate(record.archivedDate) : 'N/A';

        // Clear form
        if (restorationReason) restorationReason.value = '';
        if (restorationNotes) restorationNotes.value = '';

        // Show modal
        if (restorationModalOverlay) {
            restorationModalOverlay.classList.add('active');
        }
    }

    function closeRestorationModal() {
        if (restorationModalOverlay) {
            restorationModalOverlay.classList.remove('active');
        }
        currentRecord = null;
    }

    // Make functions globally accessible
    window.archiveApp = {
        openRestorationRequest
    };

    window.prev = function() {
        if (currentIndex > 1) {
            currentIndex--;
            showInfo();
            highlightIndexBtn();
        }
    };

    window.next = function() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            showInfo();
            highlightIndexBtn();
        }
    };

    window.paginationBtn = function(index) {
        currentIndex = index;
        displayIndexBtn();
        highlightIndexBtn();
    };

    // ============================================================================
    // EVENT LISTENERS
    // ============================================================================

    // Close modal buttons
    if (restorationModalClose) {
        restorationModalClose.addEventListener('click', closeRestorationModal);
    }

    if (restorationModalOverlay) {
        restorationModalOverlay.addEventListener('click', (e) => {
            if (e.target === restorationModalOverlay) {
                closeRestorationModal();
            }
        });
    }

    // Form submission
    if (restorationForm) {
        restorationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!currentRecord) {
                alert('No record selected!');
                return;
            }

            if (!restorationReason.value.trim()) {
                alert('Please provide a reason for restoration!');
                return;
            }

            // Get existing restoration requests
            let restorationRequests = JSON.parse(localStorage.getItem('restorationRequests')) || [];

            // Check if request already exists for this record
            const existingRequest = restorationRequests.find(r => 
                r.livestockId === currentRecord.livestockId && r.requestStatus === 'pending'
            );

            if (existingRequest) {
                alert('A pending restoration request already exists for this record!');
                return;
            }

            // Create restoration request
            const now = new Date();
            const request = {
                requestId: 'REST-' + Date.now(),
                livestockId: currentRecord.livestockId,
                kindOfLivestock: currentRecord.kindOfLivestock,
                gender: currentRecord.gender,
                weight: currentRecord.weight,
                dealerName: currentRecord.dealerName,
                status: currentRecord.status,
                createdDate: currentRecord.createdDate,
                archivedDate: currentRecord.archivedDate,
                restorationReason: restorationReason.value.trim(),
                restorationNotes: restorationNotes.value.trim() || '',
                requestStatus: 'pending', // pending, approved, rejected
                requestedBy: currentAdmin.name,
                requestedById: currentAdmin.id,
                requestedDate: now.toISOString(),
                reviewedBy: null,
                reviewedDate: null,
                reviewNotes: null
            };

            // Add to localStorage
            restorationRequests.push(request);
            localStorage.setItem('restorationRequests', JSON.stringify(restorationRequests));

            // Show success message
            showNotification('Restoration request submitted successfully! Waiting for SuperAdmin approval.', 'success');

            // Close modal
            closeRestorationModal();

            console.log('Restoration request created:', request.requestId);
        });
    }

    // Table size change
    if (tabSize) {
        tabSize.addEventListener('change', (e) => {
            tableSize = parseInt(e.target.value);
            currentIndex = 1;
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        });
    }

    // Search filter
    if (filterData) {
        filterData.addEventListener("keyup", function (e) {
            const searchString = e.target.value.trim().toLowerCase();
            
            if (searchString === '') {
                getData = [...originalData];
            } else {
                getData = originalData.filter(item => {
                    return item.livestockId.toLowerCase().includes(searchString) ||
                        item.kindOfLivestock.toLowerCase().includes(searchString) ||
                        item.gender.toLowerCase().includes(searchString) ||
                        item.weight.toString().toLowerCase().includes(searchString) ||
                        item.status.toLowerCase().includes(searchString) ||
                        (item.dealerName && item.dealerName.toLowerCase().includes(searchString));
                });
            }

            currentIndex = 1;
            preLoadCalculations();
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        });
    }

    // ============================================================================
    // NOTIFICATION FUNCTION
    // ============================================================================

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
    // INITIALIZE PAGE
    // ============================================================================

    preLoadCalculations();
    highlightIndexBtn();
    displayIndexBtn();

    console.log('=== ADMIN ARCHIVE.JS INITIALIZED SUCCESSFULLY ===');
    console.log('Total archived records:', originalData.length);
});