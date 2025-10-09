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

// ====================== DARK MODE FIX ======================
const switchMode = document.getElementById('switch-mode');

// Load saved theme
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    switchMode.checked = true;
    setLightModeColors(false);
} else {
    setLightModeColors(true);
}

// Theme toggle event
switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
        setLightModeColors(false);
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
        setLightModeColors(true);
    }
});

// ✅ Function to fix table / background for white light mode
function setLightModeColors(isLight) {
    const mainContent = document.querySelector('#content main');
    const dataWrapper = document.querySelector('.dataTables_wrapper');
    const body = document.body;

    // Add selectors for containers that were staying dark
    const containers = document.querySelectorAll('.container, .popup, .qr_scanner_popup, .table-container, .exportOptions, #content, #content main, .dataTables_wrapper');
    const tables = document.querySelectorAll('table, table th, table td, .container table, .table-container table');

    if (isLight) {
        // ensure body not in dark class
        body.classList.remove('dark');
        body.style.background = '#f4f5f9';
        if (mainContent) mainContent.style.background = '#fff';
        if (dataWrapper) dataWrapper.style.background = '#fff';

        // force container colors to white (inline styles have higher priority than many stylesheet rules)
        containers.forEach(el => {
            el.style.background = '#fff';
            el.style.color = '#111';
            el.style.borderColor = '#e6e6e6';
            el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
        });

        tables.forEach(el => {
            el.style.background = '#fff';
            el.style.color = '#111';
        });
    } else {
        // dark mode
        body.classList.add('dark');
        body.style.background = '#111827';
        if (mainContent) mainContent.style.background = '#111827';
        if (dataWrapper) dataWrapper.style.background = '#1e1e2f';

        containers.forEach(el => {
            el.style.background = '#1e1e2f';
            el.style.color = '#f9f9f9';
            el.style.borderColor = '';
            el.style.boxShadow = '';
        });

        tables.forEach(el => {
            el.style.background = '#1e1e2f';
            el.style.color = '#f9f9f9';
        });
    }
}

// ====================== PROFILE IMAGE DO NOT REMOVE ======================
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

// ====================== LIVESTOCK RECORDS MANAGEMENT ======================
document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const registerLivestockBtn = document.getElementById('registerLivestockBtn'),
        darkBg = document.querySelector('.dark_bg'),
        popupForm = document.querySelector('.popup'),
        crossBtn = document.querySelector('.closeBtn'),
        submitBtn = document.querySelector('.submitBtn'),
        cancelBtn = document.querySelector('.cancelBtn'),
        modalTitle = document.querySelector('.modalTitle'),
        popupFooter = document.querySelector('.popupFooter'),
        form = document.querySelector('form'),
        formInputFields = document.querySelectorAll('form input, form select'),
        entries = document.querySelector(".showEntries"),
        tabSize = document.getElementById("table_size"),
        userInfo = document.querySelector(".userInfo"),
        table = document.querySelector("table"),
        filterData = document.getElementById("search");

    // QR Scanner elements
    const qrScanBtn = document.getElementById('qrScanBtn'),
        qrScannerBg = document.querySelector('.qr_scanner_bg'),
        closeQRBtn = document.querySelector('.closeQRBtn'),
        livestockIdInput = document.getElementById('livestockId');

    // QR Scanner functionality
    let html5QrcodeScanner = null;

    qrScanBtn.addEventListener('click', function() {
        qrScannerBg.classList.add('active');
        startQRScanner();
    });

    closeQRBtn.addEventListener('click', function() {
        stopQRScanner();
        qrScannerBg.classList.remove('active');
    });

    function startQRScanner() {
        html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }

    function stopQRScanner() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear QR scanner", error);
            });
            html5QrcodeScanner = null;
        }
    }

    function onScanSuccess(decodedText, decodedResult) {
        // Put the scanned text into the livestock ID input
        livestockIdInput.value = decodedText;
        
        // Close the QR scanner
        stopQRScanner();
        qrScannerBg.classList.remove('active');
        
        // Show success message
        alert('QR Code scanned successfully! Livestock ID: ' + decodedText);
    }

    function onScanFailure(error) {
        // Handle scan failure silently
        console.warn(`QR scan error: ${error}`);
    }

    // Get original data from localStorage or initialize empty array
    let originalData = JSON.parse(localStorage.getItem('livestockRecords')) || [];
    let getData = [...originalData];

    let isEdit = false, editId;
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

    // Display livestock records in table
    function showInfo() {
        userInfo.innerHTML = '';

        let tab_start = startIndex - 1;
        let tab_end = endIndex;

        if (getData.length > 0) {
            for (let i = tab_start; i < tab_end; i++) {
                const record = getData[i];
                if (record) {
                    let createElement = `
                        <tr class="recordDetails">
                            <td>${record.livestockId}</td>
                            <td>${record.kindOfLivestock}</td>
                            <td>${record.gender}</td>
                            <td>${record.weight} kg</td>
                            <td>${record.status}</td>
                            <td>
                                <button onclick="window.recordsApp.readInfo('${record.livestockId}')" class="editBtn">Edit</button>
                                <button onclick="window.recordsApp.archiveInfo('${record.livestockId}')" class="archiveBtn">Archive</button>
                                <button onclick="window.recordsApp.generateReport('${record.livestockId}')" class="reportBtn">Report</button>
                            </td>
                        </tr>`;
                    userInfo.innerHTML += createElement;
                }
            }
        } else {
            userInfo.innerHTML = `<tr class="recordDetails"><td class="empty" colspan="6" align="center">No data available in table</td></tr>`;
        }
    }

    // Read/Edit record information
    function readInfo(livestockId) {
        const record = originalData.find(r => r.livestockId === livestockId);
        if (!record) return;

        const actualIndex = originalData.findIndex(r => r.livestockId === livestockId);
        
        isEdit = true;
        editId = actualIndex;

        document.getElementById("livestockId").value = record.livestockId;
        document.getElementById("kindOfLivestock").value = record.kindOfLivestock;
        document.getElementById("gender").value = record.gender;
        document.getElementById("weight").value = record.weight;
        document.getElementById("status").value = record.status;

        darkBg.classList.add('active');
        popupForm.classList.add('active');
        popupFooter.style.display = "block";
        modalTitle.innerHTML = "Edit Livestock Record";
        submitBtn.innerHTML = "Save Changes";
        cancelBtn.style.display = "inline-block";
        
        formInputFields.forEach(input => {
            input.disabled = false;
        });

        // Disable livestock ID editing
        document.getElementById("livestockId").disabled = true;
    }

    // Archive (move to archives) record
    function archiveInfo(livestockId) {
        if (confirm("Are you sure you want to archive this record? It will be moved to the Archives section.")) {
            const recordIndex = originalData.findIndex(r => r.livestockId === livestockId);
            
            if (recordIndex > -1) {
                const recordToArchive = originalData[recordIndex];
                
                // Get existing archived records or create empty array
                let archivedRecords = JSON.parse(localStorage.getItem('archivedLivestockRecords')) || [];
                
                // Add timestamp to the record when archiving
                recordToArchive.archivedDate = new Date().toISOString();
                
                // Add to archived records
                archivedRecords.push(recordToArchive);
                
                // Remove from active records
                originalData.splice(recordIndex, 1);
                
                // Update localStorage
                localStorage.setItem("livestockRecords", JSON.stringify(originalData));
                localStorage.setItem("archivedLivestockRecords", JSON.stringify(archivedRecords));

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
                
                alert("Record has been successfully archived!");
            }
        }
    }

    // Generate report for specific livestock
    function generateReport(livestockId) {
        const record = originalData.find(r => r.livestockId === livestockId);
        if (record) {
            // Create report data
            const reportData = {
                livestockId: record.livestockId,
                kindOfLivestock: record.kindOfLivestock,
                gender: record.gender,
                weight: record.weight,
                status: record.status,
                reportDate: new Date().toISOString(),
                reportType: 'Individual Livestock Report'
            };
            
            // Get existing reports or create empty array
            let reports = JSON.parse(localStorage.getItem('livestockReports')) || [];
            reports.push(reportData);
            
            // Save to localStorage
            localStorage.setItem('livestockReports', JSON.stringify(reports));
            
            // Redirect to reports page
            alert(`Report generated for Livestock ID: ${livestockId}. Redirecting to reports section...`);
            setTimeout(() => {
                window.location.href = 'reports.html';
            }, 1500);
        }
    }

    // Make functions globally accessible
    window.recordsApp = {
        readInfo,
        archiveInfo,
        generateReport
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
    registerLivestockBtn.addEventListener('click', () => {
        isEdit = false;
        submitBtn.innerHTML = "Submit";
        modalTitle.innerHTML = "Register New Livestock";
        popupFooter.style.display = "block";
        darkBg.classList.add('active');
        popupForm.classList.add('active');
        form.reset();
        cancelBtn.style.display = "none";
        
        // Enable all form fields
        formInputFields.forEach(input => {
            input.disabled = false;
        });
    });

    crossBtn.addEventListener('click', () => {
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        cancelBtn.style.display = "none";
    });

    cancelBtn.addEventListener('click', () => {
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        cancelBtn.style.display = "none";
    });

    // Click outside popup to close
    darkBg.addEventListener('click', (e) => {
        if (e.target === darkBg) {
            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            form.reset();
            cancelBtn.style.display = "none";
        }
    });

    // Click outside QR scanner to close
    qrScannerBg.addEventListener('click', (e) => {
        if (e.target === qrScannerBg) {
            stopQRScanner();
            qrScannerBg.classList.remove('active');
        }
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Validate form data
        const livestockId = document.getElementById("livestockId").value.trim();
        const kindOfLivestock = document.getElementById("kindOfLivestock").value;
        const gender = document.getElementById("gender").value;
        const weight = document.getElementById("weight").value;
        const status = document.getElementById("status").value;

        if (!livestockId || !kindOfLivestock || !gender || !weight || !status) {
            alert("Please fill in all fields");
            return;
        }

        // Check for duplicate ID when adding new record
        if (!isEdit) {
            const existingRecord = originalData.find(record => record.livestockId === livestockId);
            if (existingRecord) {
                alert("A record with this Livestock ID already exists!");
                return;
            }
        }

        // Create new record object
        const newRecord = {
            livestockId: livestockId,
            kindOfLivestock: kindOfLivestock,
            gender: gender,
            weight: parseFloat(weight),
            status: status,
            createdDate: isEdit ? originalData[editId].createdDate : new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        // Update or add record
        if (isEdit) {
            originalData[editId] = newRecord;
        } else {
            originalData.push(newRecord);
        }

        // Save to localStorage
        localStorage.setItem("livestockRecords", JSON.stringify(originalData));

        // Update getData with originalData
        getData = [...originalData];

        // Close popup and reset form
        darkBg.classList.remove('active');
        popupForm.classList.remove('active');
        form.reset();
        cancelBtn.style.display = "none";

        // Update display
        preLoadCalculations();
        showInfo();
        highlightIndexBtn();
        displayIndexBtn();

        // Show success message
        if (isEdit) {
            alert("Livestock record updated successfully!");
        } else {
            alert("New livestock record added successfully!");
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
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Livestock Records Report', 14, 22);
        
        // Add date
        doc.setFontSize(11);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 14, 32);
        
        // Prepare data for table
        const tableData = originalData.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.gender,
            record.weight + ' kg',
            record.status
        ]);
        
        // Add table
        doc.autoTable({
            head: [['Livestock ID', 'Kind of Livestock', 'Gender', 'Weight', 'Status']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [66, 69, 73],
                textColor: [255, 255, 255],
                fontSize: 11,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });
        
        // Save the PDF
        doc.save('livestock_records_' + new Date().toISOString().split('T')[0] + '.pdf');
    }

    
    // Export to Excel function
    function exportToExcel() {
        // Prepare data for Excel
        const excelData = originalData.map(record => ({
            'Livestock ID': record.livestockId,
            'Kind of Livestock': record.kindOfLivestock,
            'Gender': record.gender,
            'Weight (kg)': record.weight,
            'Status': record.status
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
            { wch: 20 }  // Status
        ];
        ws['!cols'] = colWidths;
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Livestock Records');
        
        // Save the file
        XLSX.writeFile(wb, 'livestock_records_' + new Date().toISOString().split('T')[0] + '.xlsx');
    }

    // Initialize the page
    preLoadCalculations();
    highlightIndexBtn();
    displayIndexBtn();
    
    
});