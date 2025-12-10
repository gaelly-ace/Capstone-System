// ============================================================================
// DEALER HISTORY PAGE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEALER HISTORY PAGE STARTING ===');

    // Get current dealer info
    const currentDealer = {
        id: localStorage.getItem('dealerId') || 'dealer_' + Math.random().toString(36).substr(2, 9),
        name: localStorage.getItem('dealerName') || 'Juan Dela Cruz'
    };

    // Sample history data
    const historyData = [
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
            status: "In Exit Point",
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
        },
        {
            livestockId: "LV-2024-002",
            kindOfLivestock: "Pig",
            gender: "Female",
            weight: 92.3,
            dealer: currentDealer.name,
            status: "In Exit Point",
            createdDate: new Date('2024-10-15T09:20:00').toISOString(),
            lastModified: new Date('2024-10-20T15:45:00').toISOString()
        },
        {
            livestockId: "LV-2024-005",
            kindOfLivestock: "Cattle",
            gender: "Male",
            weight: 380.7,
            dealer: currentDealer.name,
            status: "In Exit Point",
            createdDate: new Date('2024-09-10T11:00:00').toISOString(),
            lastModified: new Date('2024-09-18T13:30:00').toISOString()
        }
    ];

    let filteredData = [...historyData];

    // ========================================================================
    // HELPER FUNCTIONS
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

    function getStatusClass(status) {
        const statusClassMap = {
            'In Entry Point': 'entry',
            'In Holding Pen': 'holding',
            'In Slaughter House': 'slaughter',
            'In Exit Point': 'exit',
            'Anomaly Detected': 'anomaly'
        };
        return statusClassMap[status] || 'entry';
    }

    // ========================================================================
    // UPDATE SUMMARY
    // ========================================================================

    function updateSummary(data) {
        const totalRecords = data.length;
        const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
        const completedCount = data.filter(item => item.status === 'In Exit Point').length;
        const anomalyCount = data.filter(item => item.status === 'Anomaly Detected').length;

        document.getElementById('totalRecords').textContent = totalRecords;
        document.getElementById('totalWeight').textContent = totalWeight.toFixed(2);
        document.getElementById('completedCount').textContent = completedCount;
        document.getElementById('anomalyCount').textContent = anomalyCount;
    }

    // ========================================================================
    // LOAD TABLE VIEW
    // ========================================================================

    function loadTableView(data) {
        const tbody = document.getElementById('history-tbody');
        const emptyState = document.getElementById('emptyState');

        tbody.innerHTML = '';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Sort by date (newest first)
        const sortedData = [...data].sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );

        sortedData.forEach(record => {
            const row = createTableRow(record);
            tbody.appendChild(row);
        });
    }

    function createTableRow(record) {
        const row = document.createElement('tr');
        const statusClass = getStatusClass(record.status);
        
        row.innerHTML = `
            <td><strong>${record.livestockId}</strong></td>
            <td>${record.kindOfLivestock}</td>
            <td>${record.weight} kg</td>
            <td>${record.gender}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>${formatDate(record.createdDate)}</td>
            <td>
                <div>${formatDate(record.lastModified)}</div>
                <small style="color: var(--dark-grey); font-size: 11px;">${formatTime(record.lastModified)}</small>
            </td>
            <td>
                <button class="action-btn" onclick="viewHistoryDetails('${record.livestockId}')">
                    <i class='bx bx-show'></i> View
                </button>
            </td>
        `;
        
        return row;
    }

    // ========================================================================
    // LOAD TIMELINE VIEW
    // ========================================================================

    function loadTimelineView(data) {
        const timelineView = document.getElementById('timelineView');
        const emptyState = document.getElementById('emptyState');

        timelineView.innerHTML = '';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Sort by date (newest first)
        const sortedData = [...data].sort((a, b) => 
            new Date(b.lastModified) - new Date(a.lastModified)
        );

        sortedData.forEach(record => {
            const entry = createTimelineEntry(record);
            timelineView.appendChild(entry);
        });
    }

    function createTimelineEntry(record) {
        const entry = document.createElement('div');
        entry.className = 'timeline-entry';
        const statusClass = getStatusClass(record.status);
        
        entry.innerHTML = `
            <div class="timeline-date">
                <div class="date">${formatDate(record.lastModified)}</div>
                <div class="time">${formatTime(record.lastModified)}</div>
            </div>
            <div class="timeline-marker">
                <i class='bx bx-check'></i>
            </div>
            <div class="timeline-content">
                <div class="header">
                    <strong>${record.livestockId}</strong>
                    <span class="status-badge ${statusClass}">${record.status}</span>
                </div>
                <div class="details">
                    <div>
                        <span>Type:</span>
                        <strong>${record.kindOfLivestock}</strong>
                    </div>
                    <div>
                        <span>Weight:</span>
                        <strong>${record.weight} kg</strong>
                    </div>
                    <div>
                        <span>Gender:</span>
                        <strong>${record.gender}</strong>
                    </div>
                    <div>
                        <span>Submitted:</span>
                        <strong>${formatDate(record.createdDate)}</strong>
                    </div>
                </div>
            </div>
        `;
        
        return entry;
    }

    // ========================================================================
    // VIEW DETAILS
    // ========================================================================

    window.viewHistoryDetails = function(livestockId) {
        const record = historyData.find(l => l.livestockId === livestockId);
        
        if (!record) return;
        
        const detailsContent = document.getElementById('detailsContent');
        const detailsModal = document.getElementById('detailsModalOverlay');
        const statusClass = getStatusClass(record.status);
        
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
                <span class="detail-value">${formatDate(record.createdDate)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">${formatDate(record.lastModified)} ${formatTime(record.lastModified)}</span>
            </div>
        `;
        
        detailsModal.classList.add('active');
    };

    // ========================================================================
    // FILTER FUNCTIONALITY
    // ========================================================================

    function applyFilters() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const statusFilter = document.getElementById('statusFilter').value;

        filteredData = historyData.filter(record => {
            const recordDate = new Date(record.lastModified);
            
            // Date filter
            if (dateFrom && new Date(dateFrom) > recordDate) return false;
            if (dateTo && new Date(dateTo) < recordDate) return false;
            
            // Status filter
            if (statusFilter !== 'all' && record.status !== statusFilter) return false;
            
            return true;
        });

        updateSummary(filteredData);
        
        const currentView = document.getElementById('tableView').classList.contains('active') ? 'table' : 'timeline';
        if (currentView === 'table') {
            loadTableView(filteredData);
        } else {
            loadTimelineView(filteredData);
        }
    }

    function clearFilters() {
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        document.getElementById('statusFilter').value = 'all';
        
        filteredData = [...historyData];
        updateSummary(filteredData);
        
        const currentView = document.getElementById('tableView').classList.contains('active') ? 'table' : 'timeline';
        if (currentView === 'table') {
            loadTableView(filteredData);
        } else {
            loadTimelineView(filteredData);
        }
    }

    // ========================================================================
    // VIEW TOGGLE
    // ========================================================================

    const tableViewBtn = document.getElementById('tableViewBtn');
    const timelineViewBtn = document.getElementById('timelineViewBtn');
    const tableView = document.getElementById('tableView');
    const timelineView = document.getElementById('timelineView');

    tableViewBtn.addEventListener('click', () => {
        tableViewBtn.classList.add('active');
        timelineViewBtn.classList.remove('active');
        tableView.classList.add('active');
        timelineView.classList.remove('active');
        loadTableView(filteredData);
    });

    timelineViewBtn.addEventListener('click', () => {
        timelineViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        timelineView.classList.add('active');
        tableView.classList.remove('active');
        loadTimelineView(filteredData);
    });

    // ========================================================================
    // EXPORT FUNCTIONALITY
    // ========================================================================

    document.getElementById('exportBtn').addEventListener('click', () => {
        const csv = convertToCSV(filteredData);
        downloadCSV(csv, 'livestock_history.csv');
    });

    function convertToCSV(data) {
        const headers = ['Livestock ID', 'Type', 'Weight (kg)', 'Gender', 'Status', 'Date Submitted', 'Last Updated'];
        const rows = data.map(record => [
            record.livestockId,
            record.kindOfLivestock,
            record.weight,
            record.gender,
            record.status,
            formatDate(record.createdDate),
            formatDate(record.lastModified) + ' ' + formatTime(record.lastModified)
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        return csvContent;
    }

    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ========================================================================
    // SEARCH FUNCTIONALITY
    // ========================================================================

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const currentView = document.getElementById('tableView').classList.contains('active') ? 'table' : 'timeline';
            
            const searchResults = filteredData.filter(record => 
                record.livestockId.toLowerCase().includes(searchTerm) ||
                record.kindOfLivestock.toLowerCase().includes(searchTerm) ||
                record.status.toLowerCase().includes(searchTerm)
            );

            if (currentView === 'table') {
                loadTableView(searchResults);
            } else {
                loadTimelineView(searchResults);
            }
        });
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    document.getElementById('applyFilter').addEventListener('click', applyFilters);
    document.getElementById('clearFilter').addEventListener('click', clearFilters);

    // Modal close
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

    // ========================================================================
    // INITIALIZE
    // ========================================================================

    updateSummary(filteredData);
    loadTableView(filteredData);

    console.log('=== DEALER HISTORY PAGE INITIALIZED ===');
});