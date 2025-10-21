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

// Livestock Records Management Functionality
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
        entries = document.querySelector(".showEntries"),
        tabSize = document.getElementById("table_size"),
        userInfo = document.querySelector(".userInfo"),
        table = document.querySelector("table"),
        filterData = document.getElementById("search");

    // QR Scanner elements
    const qrScanBtn = document.getElementById('qrScanBtn'),
        qrScannerBg = document.querySelector('.qr_scanner_bg'),
        closeQRBtn = document.querySelector('.closeQRBtn'),
        livestockIdValue = document.getElementById('livestockIdValue');

    // Gender selection elements
    const genderOptions = document.querySelectorAll('.gender-option'),
        genderInput = document.getElementById('gender');

    // Weight control elements
    const weightValue = document.getElementById('weightValue'),
        weightInput = document.getElementById('weight'),
        weightUpBtn = document.getElementById('weightUp'),
        weightDownBtn = document.getElementById('weightDown'),
        weightInputField = document.getElementById('weightInputField');

    // Initialize weight and gender
    let currentWeight = 0.0;
    let selectedGender = '';
    let scannedId = '';

    // Sample data - Pre-populated records
    let originalData = [
        {
            livestockId: "LV-2024-001",
            kindOfLivestock: "Pig",
            gender: "Male",
            weight: 85.5,
            dealer: "Juan Dela Cruz",
            status: "In Entry Point",
            createdDate: new Date('2024-10-15T08:30:00').toISOString(),
            lastModified: new Date('2024-10-15T08:30:00').toISOString()
        },
        {
            livestockId: "LV-2024-002",
            kindOfLivestock: "Cattle",
            gender: "Female",
            weight: 320.8,
            dealer: "Maria Santos",
            status: "In Holding Pen",
            createdDate: new Date('2024-10-16T09:15:00').toISOString(),
            lastModified: new Date('2024-10-16T09:15:00').toISOString()
        },
        {
            livestockId: "LV-2024-003",
            kindOfLivestock: "Carabao",
            gender: "Male",
            weight: 450.2,
            dealer: "Pedro Garcia",
            status: "In Slaughter House",
            createdDate: new Date('2024-10-17T10:45:00').toISOString(),
            lastModified: new Date('2024-10-17T10:45:00').toISOString()
        },
        {
            livestockId: "LV-2024-004",
            kindOfLivestock: "Pig",
            gender: "Female",
            weight: 92.3,
            dealer: "Rosa Reyes",
            status: "In Exit Point",
            createdDate: new Date('2024-10-18T11:20:00').toISOString(),
            lastModified: new Date('2024-10-18T11:20:00').toISOString()
        },
        {
            livestockId: "LV-2024-005",
            kindOfLivestock: "Cattle",
            gender: "Male",
            weight: 380.5,
            dealer: "Jose Mendoza",
            status: "In Entry Point",
            createdDate: new Date('2024-10-19T07:50:00').toISOString(),
            lastModified: new Date('2024-10-19T07:50:00').toISOString()
        },
        {
            livestockId: "LV-2024-006",
            kindOfLivestock: "Pig",
            gender: "Male",
            weight: 78.9,
            dealer: "Ana Cruz",
            status: "In Holding Pen",
            createdDate: new Date('2024-10-19T14:30:00').toISOString(),
            lastModified: new Date('2024-10-19T14:30:00').toISOString()
        },
        {
            livestockId: "LV-2024-007",
            kindOfLivestock: "Carabao",
            gender: "Female",
            weight: 410.7,
            dealer: "Carlos Ramos",
            status: "Anomaly Detected",
            createdDate: new Date('2024-10-20T06:15:00').toISOString(),
            lastModified: new Date('2024-10-20T06:15:00').toISOString()
        },
        {
            livestockId: "LV-2024-008",
            kindOfLivestock: "Pig",
            gender: "Female",
            weight: 88.4,
            dealer: "Liza Torres",
            status: "In Entry Point",
            createdDate: new Date('2024-10-20T08:40:00').toISOString(),
            lastModified: new Date('2024-10-20T08:40:00').toISOString()
        }
    ];

    let getData = [...originalData];

    // QR Scanner functionality
    let html5QrcodeScanner = null;

    if (qrScanBtn) {
        qrScanBtn.addEventListener('click', function() {
            qrScannerBg.classList.add('active');
            startQRScanner();
        });
    }

    if (closeQRBtn) {
        closeQRBtn.addEventListener('click', function() {
            stopQRScanner();
            qrScannerBg.classList.remove('active');
        });
    }

    // Click outside QR scanner to close
    if (qrScannerBg) {
        qrScannerBg.addEventListener('click', (e) => {
            if (e.target === qrScannerBg) {
                stopQRScanner();
                qrScannerBg.classList.remove('active');
            }
        });
    }

    function startQRScanner() {
        html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
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
        scannedId = decodedText;
        livestockIdValue.textContent = decodedText;
        document.getElementById('livestockId').value = decodedText;
        
        stopQRScanner();
        qrScannerBg.classList.remove('active');
        
        alert('QR Code scanned successfully! Livestock ID: ' + decodedText);
    }

    function onScanFailure(error) {
        console.warn(`QR scan error: ${error}`);
    }

    // Gender selection
    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedGender = option.dataset.gender;
            genderInput.value = selectedGender;
        });
    });

    // Weight controls with typing support
    if (weightUpBtn) {
        weightUpBtn.addEventListener('click', () => {
            currentWeight += 0.1;
            currentWeight = Math.round(currentWeight * 10) / 10;
            updateWeightDisplay();
        });
    }

    if (weightDownBtn) {
        weightDownBtn.addEventListener('click', () => {
            if (currentWeight > 0) {
                currentWeight -= 0.1;
                currentWeight = Math.max(0, Math.round(currentWeight * 10) / 10);
                updateWeightDisplay();
            }
        });
    }

    // Add input event for direct typing
    if (weightInputField) {
        weightInputField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9.]/g, '');
            
            // Prevent multiple decimal points
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            e.target.value = value;
            
            if (value === '' || value === '.') {
                currentWeight = 0;
            } else {
                currentWeight = parseFloat(value) || 0;
            }
            
            weightValue.textContent = currentWeight.toFixed(1);
            weightInput.value = currentWeight;
        });

        // Add blur event to format the weight
        weightInputField.addEventListener('blur', (e) => {
            if (e.target.value) {
                currentWeight = parseFloat(e.target.value) || 0;
                e.target.value = currentWeight.toFixed(1);
                updateWeightDisplay();
            }
        });
    }

    function updateWeightDisplay() {
        weightValue.textContent = currentWeight.toFixed(1);
        weightInput.value = currentWeight;
        if (weightInputField) weightInputField.value = currentWeight.toFixed(1);
    }

    // Reset form function
    function resetForm() {
        if (form) form.reset();
        currentWeight = 0.0;
        selectedGender = '';
        scannedId = '';
        weightValue.textContent = '0.0';
        weightInput.value = '';
        if (weightInputField) weightInputField.value = '';
        genderInput.value = '';
        livestockIdValue.textContent = 'Not Scanned';
        document.getElementById('livestockId').value = '';
        document.getElementById('dealer').value = '';
        genderOptions.forEach(opt => opt.classList.remove('selected'));
    }

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
                    const createdDate = formatDate(record.createdDate);
                    const createdTime = formatTime(record.createdDate);
                    
                    let createElement = `
                        <tr class="recordDetails">
                            <td>${record.livestockId}</td>
                            <td>${record.kindOfLivestock}</td>
                            <td>${record.gender}</td>
                            <td>${record.weight} kg</td>
                            <td>${record.dealer}</td>
                            <td>${record.status}</td>
                            <td>${createdDate}</td>
                            <td>${createdTime}</td>
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
            userInfo.innerHTML = `<tr class="recordDetails"><td class="empty" colspan="9" align="center">No data available in table</td></tr>`;
        }
    }

    // Read/Edit record information
    function readInfo(livestockId) {
        const record = originalData.find(r => r.livestockId === livestockId);
        if (!record) return;

        const actualIndex = originalData.findIndex(r => r.livestockId === livestockId);
        
        isEdit = true;
        editId = actualIndex;

        scannedId = record.livestockId;
        livestockIdValue.textContent = record.livestockId;
        document.getElementById('livestockId').value = record.livestockId;
        document.getElementById("kindOfLivestock").value = record.kindOfLivestock;
        document.getElementById("dealer").value = record.dealer;
        
        selectedGender = record.gender;
        genderInput.value = record.gender;
        genderOptions.forEach(opt => {
            if (opt.dataset.gender === record.gender) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
        
        currentWeight = parseFloat(record.weight);
        updateWeightDisplay();
        
        document.getElementById("status").value = record.status;

        darkBg.classList.add('active');
        popupForm.classList.add('active');
        popupFooter.style.display = "flex";
        modalTitle.innerHTML = "Edit Livestock Record";
        submitBtn.innerHTML = "Save Changes";
    }

    // Archive record
    function archiveInfo(livestockId) {
        if (confirm("Are you sure you want to archive this record? It will be moved to the Archives section.")) {
            const recordIndex = originalData.findIndex(r => r.livestockId === livestockId);
            
            if (recordIndex > -1) {
                const recordToArchive = originalData[recordIndex];
                recordToArchive.archivedDate = new Date().toISOString();
                
                console.log('Archived:', recordToArchive);
                
                originalData.splice(recordIndex, 1);
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
            const reportData = {
                livestockId: record.livestockId,
                kindOfLivestock: record.kindOfLivestock,
                gender: record.gender,
                weight: record.weight,
                dealer: record.dealer,
                status: record.status,
                createdDate: record.createdDate,
                reportDate: new Date().toISOString(),
                reportType: 'Individual Livestock Report'
            };
            
            console.log('Report generated:', reportData);
            alert(`Report generated for Livestock ID: ${livestockId}`);
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
    if (registerLivestockBtn) {
        registerLivestockBtn.addEventListener('click', () => {
            isEdit = false;
            submitBtn.innerHTML = "Submit";
            modalTitle.innerHTML = "Register New Livestock";
            popupFooter.style.display = "flex";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
            resetForm();
        });
    }

    if (crossBtn) {
        crossBtn.addEventListener('click', () => {
            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            resetForm();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            resetForm();
        });
    }

    if (darkBg) {
        darkBg.addEventListener('click', (e) => {
            if (e.target === darkBg) {
                darkBg.classList.remove('active');
                popupForm.classList.remove('active');
                resetForm();
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (!scannedId) {
                alert("Please scan a QR code first!");
                return;
            }

            const kindOfLivestock = document.getElementById("kindOfLivestock").value;
            const dealer = document.getElementById("dealer").value;
            const status = document.getElementById("status").value;

            if (!kindOfLivestock || !selectedGender || currentWeight <= 0 || !dealer || !status) {
                alert("Please fill in all fields correctly");
                return;
            }

            if (!isEdit) {
                const existingRecord = originalData.find(record => record.livestockId === scannedId);
                if (existingRecord) {
                    alert("A record with this Livestock ID already exists!");
                    return;
                }
            }

            const newRecord = {
                livestockId: scannedId,
                kindOfLivestock: kindOfLivestock,
                gender: selectedGender,
                weight: parseFloat(currentWeight),
                dealer: dealer,
                status: status,
                createdDate: isEdit ? originalData[editId].createdDate : new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            if (isEdit) {
                originalData[editId] = newRecord;
            } else {
                originalData.push(newRecord);
            }

            getData = [...originalData];

            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            resetForm();

            preLoadCalculations();
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();

            if (isEdit) {
                alert("Livestock record updated successfully!");
            } else {
                alert("New livestock record added successfully!");
            }
        });
    }

    if (tabSize) {
        tabSize.addEventListener('change', (e) => {
            tableSize = parseInt(e.target.value);
            currentIndex = 1;
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        });
    }

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
                        item.dealer.toLowerCase().includes(searchString) ||
                        item.status.toLowerCase().includes(searchString);
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

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        
        doc.setFontSize(20);
        doc.text('Livestock Records Report', 14, 22);
        
        doc.setFontSize(11);
        doc.text('Generated on: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), 14, 32);
        
        const tableData = originalData.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.gender,
            record.weight + ' kg',
            record.dealer,
            record.status,
            formatDate(record.createdDate),
            formatTime(record.createdDate)
        ]);
        
        doc.autoTable({
            head: [['Livestock ID', 'Kind', 'Gender', 'Weight', 'Dealer', 'Status', 'Date', 'Time']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [66, 69, 73],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });
        
        doc.save('livestock_records_' + new Date().toISOString().split('T')[0] + '.pdf');
    }

    function exportToExcel() {
        const excelData = originalData.map(record => ({
            'Livestock ID': record.livestockId,
            'Kind of Livestock': record.kindOfLivestock,
            'Gender': record.gender,
            'Weight (kg)': record.weight,
            'Dealer': record.dealer,
            'Status': record.status,
            'Date Created': formatDate(record.createdDate),
            'Time Created': formatTime(record.createdDate)
        }));
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        const colWidths = [
            { wch: 15 },
            { wch: 20 },
            { wch: 10 },
            { wch: 12 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 }
        ];
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, 'Livestock Records');
        XLSX.writeFile(wb, 'livestock_records_' + new Date().toISOString().split('T')[0] + '.xlsx');
    }

    // Initialize the page
    preLoadCalculations();
    highlightIndexBtn();
    displayIndexBtn();
});