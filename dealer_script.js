// ============================================================================
// DEALER DASHBOARD SYSTEM
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEALER DASHBOARD STARTING ===');

    // Get current dealer info from localStorage
    const currentDealer = {
        id: localStorage.getItem('dealerId') || 'dealer_' + Math.random().toString(36).substr(2, 9),
        name: localStorage.getItem('dealerName') || 'Juan Dela Cruz'
    };

    // Save dealer ID for persistence
    if (!localStorage.getItem('dealerId')) {
        localStorage.setItem('dealerId', currentDealer.id);
    }
    if (!localStorage.getItem('dealerName')) {
        localStorage.setItem('dealerName', currentDealer.name);
    }

    // Display dealer name
    const dealerNameEl = document.getElementById('dealerName');
    if (dealerNameEl) {
        dealerNameEl.textContent = currentDealer.name;
    }

    // ========================================================================
    // SIDEBAR & NAVIGATION
    // ========================================================================

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

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    if (menuBar && sidebar) {
        menuBar.addEventListener('click', function () {
            sidebar.classList.toggle('hide');
        });
    }

    // SEARCH FORM
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton) {
        searchButton.addEventListener('click', function (e) {
            if (window.innerWidth < 576) {
                e.preventDefault();
                searchForm.classList.toggle('show');
                if (searchForm.classList.contains('show')) {
                    searchButtonIcon.classList.replace('bx-search', 'bx-x');
                } else {
                    searchButtonIcon.classList.replace('bx-x', 'bx-search');
                }
            }
        });
    }

    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth > 576) {
        if (searchButtonIcon && searchForm) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    }

    window.addEventListener('resize', function () {
        if (this.innerWidth > 576 && searchButtonIcon && searchForm) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });

    // DARK MODE
    const switchMode = document.getElementById('switch-mode');

    if (switchMode) {
        const darkModeStored = localStorage.getItem('darkMode');
        if (darkModeStored === 'enabled') {
            document.body.classList.add('dark');
            switchMode.checked = true;
        }

        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // PROFILE IMAGE
    const profileImg = document.getElementById('navbar-profile-img');
    const storedProfileData = localStorage.getItem('dealerProfileImage');
    if (storedProfileData && profileImg) {
        try {
            const profileData = JSON.parse(storedProfileData);
            profileImg.src = profileData.src;
        } catch (e) {
            console.error('Error loading dealer profile image:', e);
        }
    }

    // ========================================================================
    // DATA LOADING & STATISTICS
    // ========================================================================

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
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strHours = String(hours).padStart(2, '0');
        return `${strHours}:${minutes} ${ampm}`;
    }

    // Get all livestock records that belong to this dealer
    function getDealerLivestock() {
        // Get from approved livestock records (from admin_records.js)
        let allRecords = [];
        
        // Sample data for demonstration - In production, this would come from a database
        const sampleData = [
            {
                livestockId: "LV-2024-001",
                kindOfLivestock: "Pig",
                gender: "Male",
                weight: 85.5,
                dealer: currentDealer.name,
                status: "In Entry Point",
                createdDate: new Date('2024-11-25T08:30:00').toISOString(),
                lastModified: new Date('2024-11-25T08:30:00').toISOString()
            },
            {
                livestockId: "LV-2024-003",
                kindOfLivestock: "Carabao",
                gender: "Male",
                weight: 450.2,
                dealer: currentDealer.name,
                status: "In Slaughter House",
                createdDate: new Date('2024-11-20T10:45:00').toISOString(),
                lastModified: new Date('2024-11-27T14:20:00').toISOString()
            },
            {
                livestockId: "LV-2024-006",
                kindOfLivestock: "Pig",
                gender: "Male",
                weight: 78.9,
                dealer: currentDealer.name,
                status: "In Holding Pen",
                createdDate: new Date('2024-11-22T14:30:00').toISOString(),
                lastModified: new Date('2024-11-26T09:15:00').toISOString()
            },
            {
                livestockId: "LV-2024-008",
                kindOfLivestock: "Pig",
                gender: "Female",
                weight: 88.4,
                dealer: currentDealer.name,
                status: "In Exit Point",
                createdDate: new Date('2024-11-18T08:40:00').toISOString(),
                lastModified: new Date('2024-11-28T16:00:00').toISOString()
            },
            {
                livestockId: "LV-2024-010",
                kindOfLivestock: "Cattle",
                gender: "Female",
                weight: 320.5,
                dealer: currentDealer.name,
                status: "Anomaly Detected",
                createdDate: new Date('2024-11-15T10:10:00').toISOString(),
                lastModified: new Date('2024-11-29T11:30:00').toISOString()
            }
        ];

        // In production, filter from actual records
        allRecords = sampleData.filter(record => 
            record.dealer === currentDealer.name || 
            record.dealerName === currentDealer.name
        );

        return allRecords;
    }

    // Update statistics
    function updateStatistics() {
        const livestock = getDealerLivestock();
        
        const totalLivestock = livestock.length;
        const inTransit = livestock.filter(l => 
            l.status === 'In Entry Point' || 
            l.status === 'In Holding Pen' || 
            l.status === 'In Slaughter House'
        ).length;
        const completed = livestock.filter(l => 
            l.status === 'In Exit Point'
        ).length;

        document.getElementById('totalLivestock').textContent = totalLivestock;
        document.getElementById('inTransit').textContent = inTransit;
        document.getElementById('completed').textContent = completed;

        console.log('Statistics updated:', { totalLivestock, inTransit, completed });
    }

    // Load livestock table
    function loadLivestockTable() {
        const tbody = document.getElementById('livestock-tbody');
        const emptyState = document.getElementById('emptyState');
        const statusFilter = document.getElementById('statusFilter');

        if (!tbody) return;

        let livestock = getDealerLivestock();

        // Apply status filter
        const filterValue = statusFilter ? statusFilter.value : 'all';
        if (filterValue !== 'all') {
            livestock = livestock.filter(l => l.status === filterValue);
        }

        // Sort by last modified (newest first)
        livestock.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

        // Clear table
        tbody.innerHTML = '';

        // Show empty state if no livestock
        if (livestock.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }

        // Add each livestock to table
        livestock.forEach(record => {
            const row = createLivestockRow(record);
            tbody.appendChild(row);
        });

        console.log('Loaded', livestock.length, 'livestock records');
    }

    // Create livestock table row
    function createLivestockRow(record) {
        const row = document.createElement('tr');
        
        const lastUpdated = new Date(record.lastModified);
        const dateStr = formatDate(record.lastModified);
        const timeStr = formatTime(record.lastModified);
        
        // Status class mapping
        const statusClassMap = {
            'In Entry Point': 'entry',
            'In Holding Pen': 'holding',
            'In Slaughter House': 'slaughter',
            'In Exit Point': 'exit',
            'Anomaly Detected': 'anomaly'
        };
        
        const statusClass = statusClassMap[record.status] || 'entry';
        
        row.innerHTML = `
            <td><strong>${record.livestockId}</strong></td>
            <td>${record.kindOfLivestock}</td>
            <td>${record.weight} kg</td>
            <td>${record.gender}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>
                <div>${dateStr}</div>
                <small style="color: var(--dark-grey); font-size: 11px;">${timeStr}</small>
            </td>
            <td>
                <button class="action-btn" onclick="viewLivestockDetails('${record.livestockId}')">
                    <i class='bx bx-show'></i> View Details
                </button>
            </td>
        `;
        
        return row;
    }

    // View livestock details
    window.viewLivestockDetails = function(livestockId) {
        const livestock = getDealerLivestock();
        const record = livestock.find(l => l.livestockId === livestockId);
        
        if (!record) return;
        
        const detailsContent = document.getElementById('detailsContent');
        const detailsModal = document.getElementById('detailsModalOverlay');
        
        const createdDate = formatDate(record.createdDate);
        const lastModified = formatDate(record.lastModified) + ' ' + formatTime(record.lastModified);
        
        // Status class mapping
        const statusClassMap = {
            'In Entry Point': 'entry',
            'In Holding Pen': 'holding',
            'In Slaughter House': 'slaughter',
            'In Exit Point': 'exit',
            'Anomaly Detected': 'anomaly'
        };
        
        const statusClass = statusClassMap[record.status] || 'entry';
        
        detailsContent.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Livestock ID:</span>
                <span class="detail-value"><strong>${record.livestockId}</strong></span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${record.kindOfLivestock}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Gender:</span>
                <span class="detail-value">${record.gender}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Weight:</span>
                <span class="detail-value">${record.weight} kg</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Current Status:</span>
                <span class="detail-value">
                    <span class="status-badge ${statusClass}">${record.status}</span>
                </span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date Submitted:</span>
                <span class="detail-value">${createdDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">${lastModified}</span>
            </div>
            <div class="status-timeline">
                <h4>Status Timeline</h4>
                <div class="timeline-item">
                    <div class="timeline-dot"><i class='bx bx-check'></i></div>
                    <div class="timeline-content">
                        <strong>Entry Point</strong>
                        <span>${formatDate(record.createdDate)}</span>
                    </div>
                </div>
                ${record.status !== 'In Entry Point' ? `
                <div class="timeline-item">
                    <div class="timeline-dot"><i class='bx bx-check'></i></div>
                    <div class="timeline-content">
                        <strong>Holding Pen</strong>
                        <span>Processing</span>
                    </div>
                </div>
                ` : ''}
                ${record.status === 'In Slaughter House' || record.status === 'In Exit Point' ? `
                <div class="timeline-item">
                    <div class="timeline-dot"><i class='bx bx-check'></i></div>
                    <div class="timeline-content">
                        <strong>Slaughter House</strong>
                        <span>Processing</span>
                    </div>
                </div>
                ` : ''}
                ${record.status === 'In Exit Point' ? `
                <div class="timeline-item">
                    <div class="timeline-dot"><i class='bx bx-check'></i></div>
                    <div class="timeline-content">
                        <strong>Exit Point</strong>
                        <span>${formatDate(record.lastModified)}</span>
                    </div>
                </div>
                ` : ''}
                ${record.status === 'Anomaly Detected' ? `
                <div class="timeline-item">
                    <div class="timeline-dot" style="background: var(--red);"><i class='bx bx-error'></i></div>
                    <div class="timeline-content">
                        <strong style="color: var(--red);">Anomaly Detected</strong>
                        <span>Requires attention</span>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        detailsModal.classList.add('active');
    };

    // Close details modal
    const detailsModalClose = document.getElementById('detailsModalClose');
    const detailsModalOverlay = document.getElementById('detailsModalOverlay');

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

    // Status filter change
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            loadLivestockTable();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#livestock-tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // ========================================================================
    // INITIALIZE
    // ========================================================================

    updateStatistics();
    loadLivestockTable();

    console.log('=== DEALER DASHBOARD INITIALIZED ===');
});