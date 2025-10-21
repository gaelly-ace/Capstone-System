//SIDEBAR DO NOT REMOVE
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

// TOGGLE SIDEBAR DO NOT REMOVE
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

// Dark Mode - Using sessionStorage for persistence across pages
const switchMode = document.getElementById('switch-mode');

// Initialize dark mode immediately to prevent flicker
(function initializeDarkMode() {
    const darkModeState = sessionStorage.getItem('darkMode');
    if (darkModeState === 'enabled') {
        document.body.classList.add('dark');
        if (switchMode) {
            switchMode.checked = true;
        }
    }
})();

// Dark mode toggle handler
if (switchMode) {
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
            sessionStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark');
            sessionStorage.setItem('darkMode', 'disabled');
        }
    });
}

//Profile Image - Using sessionStorage for profile image persistence
document.addEventListener("DOMContentLoaded", function() {
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");

    // Load saved profile image from sessionStorage
    const savedImage = sessionStorage.getItem('profileImage');
    if (savedImage) {
        if (ProfileImg) ProfileImg.src = savedImage;
        if (NavbarProfileImg) NavbarProfileImg.src = savedImage;
    }

    function updateProfileImages(imageSrc) {
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
        }
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
        }
        // Store in sessionStorage
        sessionStorage.setItem('profileImage', imageSrc);
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
});

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Helper function to format time
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

// Initialize sample archived records if none exist
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
            },
            {
                livestockId: "LV-2024-007",
                kindOfLivestock: "Goat",
                gender: "Male",
                weight: 28.5,
                dealerName: "Jose Mendoza Farm",
                status: "Deceased",
                createdDate: new Date('2024-07-15T14:00:00').toISOString(),
                archivedDate: new Date('2024-10-18T15:20:00').toISOString()
            },
            {
                livestockId: "LV-2024-008",
                kindOfLivestock: "Carabao",
                gender: "Female",
                weight: 410.3,
                dealerName: "Teresa Ramos Livestock",
                status: "Transferred",
                createdDate: new Date('2024-08-20T08:45:00').toISOString(),
                archivedDate: new Date('2024-10-19T08:50:00').toISOString()
            }
        ];
        
        localStorage.setItem('archivedLivestockRecords', JSON.stringify(sampleArchives));
    }
}

// Archives Management Functionality
document.addEventListener("DOMContentLoaded", () => {
    // Initialize sample archives
    initializeSampleArchives();

    // Get DOM elements
    const clearAllBtn = document.getElementById('clearAllBtn'),
        entries = document.querySelector(".showEntries"),
        tabSize = document.getElementById("table_size"),
        userInfo = document.querySelector(".userInfo"),
        table = document.querySelector("table"),
        filterData = document.getElementById("search");

    // Confirmation modal elements
    const confirmationBg = document.querySelector('.confirmation_bg'),
        confirmationPopup = document.querySelector('.confirmation_popup'),
        closeConfirmBtn = document.querySelector('.closeConfirmBtn'),
        cancelConfirmBtn = document.querySelector('.cancelConfirmBtn'),
        confirmBtn = document.querySelector('.confirmBtn'),
        confirmationMessage = document.getElementById('confirmationMessage');

    // Get archived data from localStorage
    let originalData = JSON.parse(localStorage.getItem('archivedLivestockRecords')) || [];
    let getData = [...originalData];

    let currentAction = null;
    let currentRecordId = null;

    let arrayLength = 0;
    let tableSize = 10;
    let startIndex = 1;
    let endIndex = 0;
    let currentIndex = 1;
    let maxIndex = 0;

    // Pre-load calculations
    function preLoadCalculations() {
        arrayLength = getData.length;
        maxIndex = Math.ceil(arrayLength / tableSize);
    }

    // Display pagination buttons
    function displayIndexBtn() {
        preLoadCalculations();
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        pagination.innerHTML += `<button onclick="prev()" class="prev">Prev</button>`;

        for (let i = 1; i <= maxIndex; i++) {
            pagination.innerHTML += `<button onclick="paginationBtn(${i})" index="${i}">${i}</button>`;
        }

        pagination.innerHTML += `<button onclick="next()" class="next">Next</button>`;

        highlightIndexBtn();
    }

    // Highlight current page button
    function highlightIndexBtn() {
        startIndex = ((currentIndex - 1) * tableSize) + 1;
        endIndex = startIndex + tableSize - 1;

        if (endIndex > arrayLength) {
            endIndex = arrayLength;
        }

        if (arrayLength === 0) {
            entries.textContent = `Showing 0 to 0 of 0 entries`;
        } else {
            entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;
        }

        const paginationBtns = document.querySelectorAll('.pagination button');
        paginationBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('index') == currentIndex) {
                btn.classList.add('active');
            }
        });

        // Enable/disable prev and next buttons
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

    // Display archived records in table
    function showInfo() {
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
                                <button onclick="window.archivesApp.unarchiveRecord('${record.livestockId}')" class="unarchiveBtn">Unarchive</button>
                            </td>
                        </tr>`;
                    userInfo.innerHTML += createElement;
                }
            }
        } else {
            userInfo.innerHTML = `<tr class="recordDetails"><td class="empty" colspan="10" align="center">No archived records available</td></tr>`;
        }
    }

    // Show confirmation modal
    function showConfirmation(message, action, recordId = null) {
        confirmationMessage.textContent = message;
        currentAction = action;
        currentRecordId = recordId;
        confirmationBg.classList.add('active');
    }

    // Hide confirmation modal
    function hideConfirmation() {
        confirmationBg.classList.remove('active');
        currentAction = null;
        currentRecordId = null;
    }

    // Unarchive record (restore to active records)
    function unarchiveRecord(livestockId) {
        showConfirmation(
            `Are you sure you want to unarchive this record? It will be restored to the active records.`,
            'unarchive',
            livestockId
        );
    }

    // Clear all archived records
    function clearAllArchives() {
        if (originalData.length === 0) {
            alert('No archived records to clear.');
            return;
        }
        
        showConfirmation(
            `Are you sure you want to permanently delete all archived records? This action cannot be undone.`,
            'clearAll'
        );
    }

    // Execute confirmed action
    function executeAction() {
        if (currentAction === 'unarchive' && currentRecordId) {
            const recordIndex = originalData.findIndex(r => r.livestockId === currentRecordId);
            
            if (recordIndex > -1) {
                const recordToRestore = originalData[recordIndex];
                
                // Remove archived date when restoring
                delete recordToRestore.archivedDate;
                
                // Get existing active records or create empty array
                let activeRecords = JSON.parse(localStorage.getItem('livestockRecords')) || [];
                
                // Check if record already exists in active records (prevent duplicates)
                const existingActive = activeRecords.find(r => r.livestockId === recordToRestore.livestockId);
                if (existingActive) {
                    alert('A record with this ID already exists in active records!');
                    hideConfirmation();
                    return;
                }
                
                // Add to active records
                activeRecords.push(recordToRestore);
                
                // Remove from archived records
                originalData.splice(recordIndex, 1);
                
                // Update localStorage
                localStorage.setItem('livestockRecords', JSON.stringify(activeRecords));
                localStorage.setItem('archivedLivestockRecords', JSON.stringify(originalData));

                getData = [...originalData];

                preLoadCalculations();
                if (getData.length === 0) {
                    currentIndex = 1;
                    startIndex = 1;
                    endIndex = 0;
                } else if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }

                showInfo();
                highlightIndexBtn();
                displayIndexBtn();
                
                alert("Record has been successfully restored to active records!");
            }
        } else if (currentAction === 'clearAll') {
            // Clear all archived records
            originalData = [];
            getData = [];
            
            // Update localStorage
            localStorage.setItem('archivedLivestockRecords', JSON.stringify(originalData));
            
            // Reset pagination
            currentIndex = 1;
            startIndex = 1;
            endIndex = 0;
            
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
            
            alert("All archived records have been permanently deleted!");
        }
        
        hideConfirmation();
    }

    // Make functions globally accessible
    window.archivesApp = {
        unarchiveRecord,
        clearAllArchives
    };

    // Pagination functions
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

    // Event Listeners
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllArchives);
    }

    // Confirmation modal event listeners
    if (closeConfirmBtn) {
        closeConfirmBtn.addEventListener('click', hideConfirmation);
    }

    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', hideConfirmation);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', executeAction);
    }

    // Click outside confirmation modal to close
    if (confirmationBg) {
        confirmationBg.addEventListener('click', (e) => {
            if (e.target === confirmationBg) {
                hideConfirmation();
            }
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

    // Search functionality
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

    // Export functionality
    const exportPDFBtn = document.getElementById('exportPDF');
    const exportExcelBtn = document.getElementById('exportExcel');

    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', function() {
            exportToPDF();
        });
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportToExcel();
        });
    }

    // Export to PDF function
    function exportToPDF() {
        if (originalData.length === 0) {
            alert('No archived records to export.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        
        // Add title
        doc.setFontSize(20);
        doc.text('Archived Livestock Records Report', 14, 22);
        
        // Add date
        doc.setFontSize(11);
        doc.text('Generated on: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), 14, 32);
        
        // Prepare data for table
        const tableData = originalData.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.gender,
            record.weight + ' kg',
            record.dealerName || 'N/A',
            record.status,
            record.createdDate ? formatDate(record.createdDate) : 'N/A',
            record.createdDate ? formatTime(record.createdDate) : 'N/A',
            record.archivedDate ? formatDate(record.archivedDate) : 'N/A'
        ]);
        
        // Add table
        doc.autoTable({
            head: [['Livestock ID', 'Kind', 'Gender', 'Weight', 'Dealer', 'Status', 'Date Created', 'Time Created', 'Archived']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 7,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [66, 69, 73],
                textColor: [255, 255, 255],
                fontSize: 8,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });
        
        // Save the PDF
        doc.save('archived_livestock_records_' + new Date().toISOString().split('T')[0] + '.pdf');
    }

    // Export to Excel function
    function exportToExcel() {
        if (originalData.length === 0) {
            alert('No archived records to export.');
            return;
        }

        // Prepare data for Excel
        const excelData = originalData.map(record => ({
            'Livestock ID': record.livestockId,
            'Kind of Livestock': record.kindOfLivestock,
            'Gender': record.gender,
            'Weight (kg)': record.weight,
            'Dealer Name': record.dealerName || 'N/A',
            'Status': record.status,
            'Date Created': record.createdDate ? formatDate(record.createdDate) : 'N/A',
            'Time Created': record.createdDate ? formatTime(record.createdDate) : 'N/A',
            'Archived Date': record.archivedDate ? formatDate(record.archivedDate) : 'N/A'
        }));
        
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Set column widths
        const colWidths = [
            { wch: 15 }, // Livestock ID
            { wch: 20 }, // Kind of Livestock
            { wch: 10 }, // Gender
            { wch: 12 }, // Weight
            { wch: 25 }, // Dealer Name
            { wch: 20 }, // Status
            { wch: 15 }, // Date Created
            { wch: 15 }, // Time Created
            { wch: 15 }  // Archived Date
        ];
        ws['!cols'] = colWidths;
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Archived Records');
        
        // Save the file
        XLSX.writeFile(wb, 'archived_livestock_records_' + new Date().toISOString().split('T')[0] + '.xlsx');
    }

    // Initialize the page
    preLoadCalculations();
    highlightIndexBtn();
    displayIndexBtn();
});