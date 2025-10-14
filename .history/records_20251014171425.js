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

if(searchButton) {
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

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	if(searchButtonIcon) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
	}
	if(searchForm) {
		searchForm.classList.remove('show');
	}
}

window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		if(searchButtonIcon) {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
		if(searchForm) {
			searchForm.classList.remove('show');
		}
	}
})

// Dark Mode DO NOT REMOVE
const switchMode = document.getElementById('switch-mode');

// Check stored preference on page load
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    if(switchMode) switchMode.checked = true;
} else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    if(switchMode) switchMode.checked = false;
}

if(switchMode) {
	switchMode.addEventListener('change', function () {
		if (this.checked) {
			document.documentElement.classList.add('dark');
			document.body.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			document.body.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	});
}

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

    if(qrScanBtn) {
        qrScanBtn.addEventListener('click', function() {
            qrScannerBg.classList.add('active');
            startQRScanner();
        });
    }

    if(closeQRBtn) {
        closeQRBtn.addEventListener('click', function() {
            stopQRScanner();
            qrScannerBg.classList.remove('active');
        });
    }

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
        livestockIdInput.value = decodedText;
        stopQRScanner();
        qrScannerBg.classList.remove('active');
        alert('QR Code scanned successfully! Livestock ID: ' + decodedText);
    }

    function onScanFailure(error) {
        console.warn(`QR scan error: ${error}`);
    }

    // Get original data from localStorage or initialize with sample data
    let originalData = JSON.parse(localStorage.getItem('livestockRecords')) || [
        {
            livestockId: "LS-001",
            kindOfLivestock: "Pig",
            gender: "Male",
            weight: 85,
            status: "In Entry Point",
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        },
        {
            livestockId: "LS-002",
            kindOfLivestock: "Cattle",
            gender: "Female",
            weight: 120,
            status: "In Holding Pen",
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        },
        {
            livestockId: "LS-003",
            kindOfLivestock: "Carabao",
            gender: "Male",
            weight: 200,
            status: "In Slaughter House",
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        },
        {
            livestockId: "LS-004",
            kindOfLivestock: "Pig",
            gender: "Female",
            weight: 95,
            status: "In Exit Point",
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        },
        {
            livestockId: "LS-005",
            kindOfLivestock: "Cattle",
            gender: "Male",
            weight: 150,
            status: "Anomaly Detected",
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        }
    ];

    // Save initial data if not exists
    if (!localStorage.getItem('livestockRecords')) {
        localStorage.setItem('livestockRecords', JSON.stringify(originalData));
    }

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
        if (maxIndex < 1) maxIndex = 1;
    }

    // Display pagination buttons
    function displayIndexBtn() {
        preLoadCalculations();
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        pagination.innerHTML = '';

        // First button
        pagination.innerHTML += `<button onclick="window.paginationControls.first()" class="first ${currentIndex === 1 ? 'disabled' : ''}">First</button>`;
        
        // Prev button
        pagination.innerHTML += `<button onclick="window.paginationControls.prev()" class="prev ${currentIndex === 1 ? 'disabled' : ''}">Prev</button>`;

        // Page numbers
        let startPage = Math.max(1, currentIndex - 2);
        let endPage = Math.min(maxIndex, currentIndex + 2);

        // Adjust if we're near the start
        if (currentIndex <= 3) {
            endPage = Math.min(5, maxIndex);
        }

        // Adjust if we're near the end
        if (currentIndex >= maxIndex - 2) {
            startPage = Math.max(1, maxIndex - 4);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pagination.innerHTML += `<button onclick="window.paginationControls.goToPage(1)" index="1">1</button>`;
            if (startPage > 2) {
                pagination.innerHTML += `<span class="ellipsis">...</span>`;
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            pagination.innerHTML += `<button onclick="window.paginationControls.goToPage(${i})" index="${i}" class="${i === currentIndex ? 'active' : ''}">${i}</button>`;
        }

        // Add ellipsis and last page if needed
        if (endPage < maxIndex) {
            if (endPage < maxIndex - 1) {
                pagination.innerHTML += `<span class="ellipsis">...</span>`;
            }
            pagination.innerHTML += `<button onclick="window.paginationControls.goToPage(${maxIndex})" index="${maxIndex}">${maxIndex}</button>`;
        }

        // Next button
        pagination.innerHTML += `<button onclick="window.paginationControls.next()" class="next ${currentIndex === maxIndex ? 'disabled' : ''}">Next</button>`;
        
        // Last button
        pagination.innerHTML += `<button onclick="window.paginationControls.last()" class="last ${currentIndex === maxIndex ? 'disabled' : ''}">Last</button>`;

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
            if(entries) entries.textContent = `Showing 0 to 0 of 0 entries`;
        } else {
            if(entries) entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;
        }

        showInfo();
    }

    // Display livestock records in table
    function showInfo() {
        if (!userInfo) return;
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
                                <button onclick="window.recordsApp.readInfo('${record.livestockId}')" class="editBtn"><i class="fas fa-edit"></i> Edit</button>
                                <button onclick="window.recordsApp.archiveInfo('${record.livestockId}')" class="archiveBtn"><i class="fas fa-archive"></i> Archive</button>
                                <button onclick="window.recordsApp.generateReport('${record.livestockId}')" class="reportBtn"><i class="fas fa-file-alt"></i> Report</button>
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

        document.getElementById("livestockId").disabled = true;
    }

    // Archive record
    function archiveInfo(livestockId) {
        if (confirm("Are you sure you want to archive this record? It will be moved to the Archives section.")) {
            const recordIndex = originalData.findIndex(r => r.livestockId === livestockId);
            
            if (recordIndex > -1) {
                const recordToArchive = originalData[recordIndex];
                
                let archivedRecords = JSON.parse(localStorage.getItem('archivedLivestockRecords')) || [];
                recordToArchive.archivedDate = new Date().toISOString();
                archivedRecords.push(recordToArchive);
                
                originalData.splice(recordIndex, 1);
                
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

    // Generate report
    function generateReport(livestockId) {
        const record = originalData.find(r => r.livestockId === livestockId);
        if (record) {
            const reportData = {
                livestockId: record.livestockId,
                kindOfLivestock: record.kindOfLivestock,
                gender: record.gender,
                weight: record.weight,
                status: record.status,
                reportDate: new Date().toISOString(),
                reportType: 'Individual Livestock Report'
            };
            
            let reports = JSON.parse(localStorage.getItem('livestockReports')) || [];
            reports.push(reportData);
            localStorage.setItem('livestockReports', JSON.stringify(reports));
            
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

    // Pagination controls
    window.paginationControls = {
        first: function() {
            if (currentIndex !== 1) {
                currentIndex = 1;
                displayIndexBtn();
                highlightIndexBtn();
            }
        },
        
        prev: function() {
            if (currentIndex > 1) {
                currentIndex--;
                displayIndexBtn();
                highlightIndexBtn();
            }
        },
        
        next: function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                displayIndexBtn();
                highlightIndexBtn();
            }
        },
        
        last: function() {
            if (currentIndex !== maxIndex) {
                currentIndex = maxIndex;
                displayIndexBtn();
                highlightIndexBtn();
            }
        },
        
        goToPage: function(page) {
            if (page >= 1 && page <= maxIndex) {
                currentIndex = page;
                displayIndexBtn();
                highlightIndexBtn();
            }
        }
    };

    // Event Listeners
    if(registerLivestockBtn) {
        registerLivestockBtn.addEventListener('click', () => {
            isEdit = false;
            submitBtn.innerHTML = "Submit";
            modalTitle.innerHTML = "Register New Livestock";
            popupFooter.style.display = "block";
            darkBg.classList.add('active');
            popupForm.classList.add('active');
            form.reset();
            cancelBtn.style.display = "none";
            
            formInputFields.forEach(input => {
                input.disabled = false;
            });
        });
    }

    if(crossBtn) {
        crossBtn.addEventListener('click', () => {
            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            form.reset();
            cancelBtn.style.display = "none";
        });
    }

    if(cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            form.reset();
            cancelBtn.style.display = "none";
        });
    }

    if(darkBg) {
        darkBg.addEventListener('click', (e) => {
            if (e.target === darkBg) {
                darkBg.classList.remove('active');
                popupForm.classList.remove('active');
                form.reset();
                cancelBtn.style.display = "none";
            }
        });
    }

    if(qrScannerBg) {
        qrScannerBg.addEventListener('click', (e) => {
            if (e.target === qrScannerBg) {
                stopQRScanner();
                qrScannerBg.classList.remove('active');
            }
        });
    }

    if(submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const livestockId = document.getElementById("livestockId").value.trim();
            const kindOfLivestock = document.getElementById("kindOfLivestock").value;
            const gender = document.getElementById("gender").value;
            const weight = document.getElementById("weight").value;
            const status = document.getElementById("status").value;

            if (!livestockId || !kindOfLivestock || !gender || !weight || !status) {
                alert("Please fill in all fields");
                return;
            }

            if (!isEdit) {
                const existingRecord = originalData.find(record => record.livestockId === livestockId);
                if (existingRecord) {
                    alert("A record with this Livestock ID already exists!");
                    return;
                }
            }

            const newRecord = {
                livestockId: livestockId,
                kindOfLivestock: kindOfLivestock,
                gender: gender,
                weight: parseFloat(weight),
                status: status,
                createdDate: isEdit ? originalData[editId].createdDate : new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            if (isEdit) {
                originalData[editId] = newRecord;
            } else {
                originalData.push(newRecord);
            }

            localStorage.setItem("livestockRecords", JSON.stringify(originalData));
            getData = [...originalData];

            darkBg.classList.remove('active');
            popupForm.classList.remove('active');
            form.reset();
            cancelBtn.style.display = "none";

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

    // Table size change
    if(tabSize) {
        tabSize.addEventListener('change', (e) => {
            tableSize = parseInt(e.target.value);
            currentIndex = 1;
            preLoadCalculations();
            showInfo();
            highlightIndexBtn();
            displayIndexBtn();
        });
    }

    // Search functionality
    if(filterData) {
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
    }

    // Export functionality
    const exportPDFBtn = document.getElementById('exportPDF');
    const exportExcelBtn = document.getElementById('exportExcel');

    if(exportPDFBtn) {
        exportPDFBtn.addEventListener('click', function() {
            exportToPDF();
        });
    }

    if(exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportToExcel();
        });
    }

    // Export to PDF function
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('Livestock Records Report', 14, 22);
        
        doc.setFontSize(11);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 14, 32);
        
        const tableData = originalData.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.gender,
            record.weight + ' kg',
            record.status
        ]);
        
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
        
        doc.save('livestock_records_' + new Date().toISOString().split('T')[0] + '.pdf');
    }

    // Export to Excel function
    function exportToExcel() {
        const excelData = originalData.map(record => ({
            'Livestock ID': record.livestockId,
            'Kind of Livestock': record.kindOfLivestock,
            'Gender': record.gender,
            'Weight (kg)': record.weight,
            'Status': record.status
        }));
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        const colWidths = [
            { wch: 15 },
            { wch: 20 },
            { wch: 10 },
            { wch: 12 },
            { wch: 20 }
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
