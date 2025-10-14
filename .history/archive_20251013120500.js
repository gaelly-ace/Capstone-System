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

// Dark Mode DO NOT REMOVE
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

//Profile Image DO NOT REMOVE
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
});

// Archives Management Functionality
document.addEventListener("DOMContentLoaded", () => {
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
                    const archivedDate = record.archivedDate ? 
                        new Date(record.archivedDate).toLocaleDateString() : 
                        'N/A';
                    
                    let createElement = `
                        <tr class="recordDetails">
                            <td>${record.livestockId}</td>
                            <td>${record.kindOfLivestock}</td>
                            <td>${record.gender}</td>
                            <td>${record.weight} kg</td>
                            <td>${record.status}</td>
                            <td class="archived-date">${archivedDate}</td>
                            <td>
                                <button onclick="window.archivesApp.unarchiveRecord('${record.livestockId}')" class="unarchiveBtn">Unarchive</button>
                            </td>
                        </tr>`;
                    userInfo.innerHTML += createElement;
                }
            }
        } else {
            userInfo.innerHTML = `<tr class="recordDetails"><td class="empty" colspan="7" align="center">No archived records available</td></tr>`;
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
    clearAllBtn.addEventListener('click', clearAllArchives);

    // Confirmation modal event listeners
    closeConfirmBtn.addEventListener('click', hideConfirmation);
    cancelConfirmBtn.addEventListener('click', hideConfirmation);
    confirmBtn.addEventListener('click', executeAction);

    // Click outside confirmation modal to close
    confirmationBg.addEventListener('click', (e) => {
        if (e.target === confirmationBg) {
            hideConfirmation();
        }
    });

    // Table size change
    tabSize.addEventListener('change', (e) => {
        tableSize = parseInt(e.target.value);
        currentIndex = 1;
        showInfo();
        highlightIndexBtn();
        displayIndexBtn();
    });

    // Search functionality
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
                    item.status.toLowerCase().includes(searchString);
            });
        }

        currentIndex = 1;
        preLoadCalculations();
        showInfo();
        highlightIndexBtn();
        displayIndexBtn();
    });

    // Export functionality
    document.getElementById('exportPDF').addEventListener('click', function() {
        exportToPDF();
    });

    document.getElementById('exportExcel').addEventListener('click', function() {
        exportToExcel();
    });

    // Export to PDF function
    function exportToPDF() {
        if (originalData.length === 0) {
            alert('No archived records to export.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Archived Livestock Records Report', 14, 22);
        
        // Add date
        doc.setFontSize(11);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 14, 32);
        
        // Prepare data for table
        const tableData = originalData.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.gender,
            record.weight + ' kg',
            record.status,
            record.archivedDate ? new Date(record.archivedDate).toLocaleDateString() : 'N/A'
        ]);
        
        // Add table
        doc.autoTable({
            head: [['Livestock ID', 'Kind of Livestock', 'Gender', 'Weight', 'Status', 'Archived Date']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [66, 69, 73],
                textColor: [255, 255, 255],
                fontSize: 10,
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
            'Status': record.status,
            'Archived Date': record.archivedDate ? new Date(record.archivedDate).toLocaleDateString() : 'N/A'
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
            { wch: 20 }, // Status
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
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});
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
});
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
});
const switchMode = document.getElementById('switch-mode');
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    document.documentElement.classList.add('dark');
    switchMode.checked = true;
} else {
    document.body.classList.remove('dark');
    document.documentElement.classList.remove('dark');
    switchMode.checked = false;
}
switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
    } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
    }
});
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
                };
                reader.readAsDataURL(file);
            }
        };
    }
});
// … rest of archive.js functionality remains unchanged …
