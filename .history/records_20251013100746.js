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
/**
 * Enhanced Pagination and Layout JavaScript
 * Add this to your existing records.js or include it separately
 */

$(document).ready(function() {
    // Enhanced DataTable initialization
    const table = $('#livestockTable').DataTable({
        // Basic configuration
        pageLength: 10,
        lengthChange: false,
        searching: false, // We'll use custom search
        info: true,
        
        // Language customization to match the second image
        language: {
            emptyTable: "No data available in table",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            infoEmpty: "Showing 0 to 0 of 0 entries",
            infoFiltered: "(filtered from _MAX_ total entries)",
            paginate: {
                first: "First",
                last: "Last", 
                next: "Next",
                previous: "Prev"
            },
            processing: "Loading..."
        },
        
        // DOM structure - remove default search and length controls
        dom: 't<"row mt-3"<"col-sm-6"i><"col-sm-6"p>>',
        
        // Use full_numbers for complete pagination
        pagingType: "full_numbers",
        
        // Processing indicator
        processing: true,
        
        // Column definitions for better formatting
        columnDefs: [
            { 
                targets: [3], // Weight column
                render: function(data, type, row) {
                    if (type === 'display' && data) {
                        return data.toString().includes('kg') ? data : data + ' kg';
                    }
                    return data;
                }
            },
            {
                targets: [5], // Action column
                orderable: false,
                searchable: false
            }
        ],
        
        // Row callback for styling
        rowCallback: function(row, data, index) {
            // Add zebra striping
            if (index % 2 === 0) {
                $(row).addClass('even-row');
            }
            
            // Highlight anomaly status
            if (data[4] === 'Anomaly Detected') {
                $(row).addClass('anomaly-row');
            }
        },
        
        // Draw callback to enhance pagination after each redraw
        drawCallback: function(settings) {
            enhancePaginationButtons();
            updateInfoDisplay();
        }
    });

    // Custom search functionality
    $('#search').on('keyup change', function() {
        const searchValue = this.value;
        table.search(searchValue).draw();
        
        // Update URL without refreshing (for bookmarking)
        if (searchValue) {
            history.replaceState(null, null, '?search=' + encodeURIComponent(searchValue));
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    });

    // Custom entries per page
    $('#table_size').on('change', function() {
        const newLength = parseInt(this.value);
        table.page.len(newLength).draw();
        
        // Store user preference
        localStorage.setItem('livestockTableLength', newLength);
    });

    // Load saved preferences
    const savedLength = localStorage.getItem('livestockTableLength');
    if (savedLength) {
        $('#table_size').val(savedLength);
        table.page.len(parseInt(savedLength)).draw();
    }

    // Load search from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        $('#search').val(searchParam);
        table.search(searchParam).draw();
    }

    // Function to enhance pagination buttons
    function enhancePaginationButtons() {
        // Add tooltips to pagination buttons
        $('.paginate_button.previous').attr('title', 'Go to previous page');
        $('.paginate_button.next').attr('title', 'Go to next page');
        $('.paginate_button.first').attr('title', 'Go to first page');
        $('.paginate_button.last').attr('title', 'Go to last page');
        
        // Add current page indicator for screen readers
        $('.paginate_button.current').attr('aria-current', 'page');
        
        // Add keyboard navigation
        $('.paginate_button').off('keydown.pagination').on('keydown.pagination', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });

        // Add visual feedback for button states
        $('.paginate_button').each(function() {
            const $btn = $(this);
            
            if ($btn.hasClass('disabled')) {
                $btn.attr('aria-disabled', 'true');
                $btn.attr('tabindex', '-1');
            } else {
                $btn.attr('aria-disabled', 'false');
                $btn.attr('tabindex', '0');
            }
        });
    }

    // Function to update info display
    function updateInfoDisplay() {
        const info = table.page.info();
        const customInfo = `Showing ${info.start + 1} to ${info.end} of ${info.recordsTotal} entries`;
        
        if (info.recordsFiltered !== info.recordsTotal) {
            const filteredInfo = ` (filtered from ${info.recordsTotal} total entries)`;
            $('.dataTables_info').html(customInfo + filteredInfo);
        }
    }

    // Export menu functionality
    $('.exportBtn').on('click', function(e) {
        e.stopPropagation();
        $('.exportOptions').slideToggle(200);
        $(this).toggleClass('active');
    });

    // Close export menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.exportMenu').length) {
            $('.exportOptions').slideUp(200);
            $('.exportBtn').removeClass('active');
        }
    });

    // Enhanced export functionality
    $('#exportPDF').on('click', function() {
        exportToPDF();
        $('.exportOptions').slideUp(200);
    });

    $('#exportExcel').on('click', function() {
        exportToExcel();
        $('.exportOptions').slideUp(200);
    });

    // Theme toggle with smooth transition
    $('#switch-mode').on('change', function() {
        const isChecked = this.checked;
        
        // Add transition class
        $('body').addClass('theme-transitioning');
        
        setTimeout(() => {
            if (isChecked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
            
            // Remove transition class
            setTimeout(() => {
                $('body').removeClass('theme-transitioning');
            }, 300);
        }, 50);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        $('#switch-mode').prop('checked', true);
    }

    // Register livestock button functionality
    $('#registerLivestockBtn').on('click', function() {
        $('.dark_bg').fadeIn(300);
        $('body').addClass('modal-open');
    });

    // Close modal functionality
    $('.closeBtn, .dark_bg').on('click', function(e) {
        if (e.target === this) {
            $('.dark_bg').fadeOut(300);
            $('body').removeClass('modal-open');
        }
    });

    // Form submission
    $('#myForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            livestockId: $('#livestockId').val(),
            kindOfLivestock: $('#kindOfLivestock').val(),
            gender: $('#gender').val(),
            weight: $('#weight').val(),
            status: $('#status').val()
        };

        // Add to table
        table.row.add([
            formData.livestockId,
            formData.kindOfLivestock,
            formData.gender,
            formData.weight + ' kg',
            formData.status,
            '<button><i class="fas fa-edit"></i> Edit</button>'
        ]).draw();

        // Close modal and reset form
        $('.dark_bg').fadeOut(300);
        $('body').removeClass('modal-open');
        this.reset();

        // Show success message
        showNotification('Livestock registered successfully!', 'success');
    });

    // Utility functions
    function exportToPDF() {
        // Implementation for PDF export
        showNotification('Exporting to PDF...', 'info');
        
        // You can implement actual PDF export here
        setTimeout(() => {
            showNotification('PDF export completed!', 'success');
        }, 2000);
    }

    function exportToExcel() {
        // Implementation for Excel export
        showNotification('Exporting to Excel...', 'info');
        
        // You can implement actual Excel export here
        setTimeout(() => {
            showNotification('Excel export completed!', 'success');
        }, 2000);
    }

    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification notification-${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `);

        $('body').append(notification);
        
        setTimeout(() => {
            notification.addClass('show');
        }, 100);

        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            $('#search').focus();
        }
        
        // Ctrl/Cmd + N for new livestock
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            $('#registerLivestockBtn').click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            $('.dark_bg, .qr_scanner_bg').fadeOut(300);
            $('body').removeClass('modal-open');
        }
    });

    // Initialize tooltips and accessibility
    function initializeAccessibility() {
        // Add proper ARIA labels
        $('#search').attr('aria-label', 'Search livestock records');
        $('#table_size').attr('aria-label', 'Number of entries to show');
        
        // Add role and aria-label to table
        $('#livestockTable').attr('role', 'table');
        $('#livestockTable').attr('aria-label', 'Livestock records table');
        
        // Add column headers for screen readers
        $('#livestockTable thead th').each(function(index) {
            $(this).attr('scope', 'col');
        });
    }

    // Initialize everything
    initializeAccessibility();
    enhancePaginationButtons();

    // Window resize handler for responsive pagination
    $(window).on('resize', function() {
        // Adjust pagination on screen size changes
        setTimeout(() => {
            table.columns.adjust();
        }, 100);
    });
});

// CSS for notifications and transitions
const additionalCSS = `
<style>
/* Notification styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border-left: 4px solid #007bff;
    padding: 15px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 9999;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-success {
    border-left-color: #28a745;
    color: #155724;
}

.notification-error {
    border-left-color: #dc3545;
    color: #721c24;
}

.notification-info {
    border-left-color: #17a2b8;
    color: #0c5460;
}

/* Theme transition */
.theme-transitioning * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
}

/* Modal open body style */
body.modal-open {
    overflow: hidden;
}

/* Enhanced row styles */
.even-row {
    background-color: #f8f9fa;
}

[data-theme="dark"] .even-row {
    background-color: #374151;
}

.anomaly-row {
    background-color: #fff3cd !important;
    border-left: 3px solid #ffc107;
}

[data-theme="dark"] .anomaly-row {
    background-color: #3d3d1a !important;
    border-left-color: #ffc107;
}

/* Export button active state */
.exportBtn.active {
    background-color: #0056b3 !important;
    transform: rotate(180deg);
}

.exportBtn.active i.fa-chevron-down {
    transform: rotate(180deg);
}
</style>
`;

// Inject additional CSS
$('head').append(additionalCSS);