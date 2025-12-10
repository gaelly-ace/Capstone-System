// ============================================================================
// DEALER LIVESTOCK MANAGEMENT
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEALER LIVESTOCK PAGE STARTING ===');

    // Get current dealer info
    const currentDealer = {
        id: localStorage.getItem('dealerId') || 'dealer_' + Math.random().toString(36).substr(2, 9),
        name: localStorage.getItem('dealerName') || 'Juan Dela Cruz'
    };

    // Sample livestock data
    let livestockData = [
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
        }
    ];

    let editingId = null;
    let deletingId = null;

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

    function generateLivestockId() {
        const year = new Date().getFullYear();
        const count = livestockData.length + 1;
        return `LV-${year}-${String(count).padStart(3, '0')}`;
    }

    // ========================================================================
    // UPDATE STATISTICS
    // ========================================================================

    function updateStats() {
        const totalPigs = livestockData.filter(l => l.kindOfLivestock === 'Pig').length;
        const totalCattle = livestockData.filter(l => l.kindOfLivestock === 'Cattle').length;
        const totalCarabao = livestockData.filter(l => l.kindOfLivestock === 'Carabao').length;
        const totalWeight = livestockData.reduce((sum, l) => sum + l.weight, 0);

        document.getElementById('totalPigs').textContent = totalPigs;
        document.getElementById('totalCattle').textContent = totalCattle;
        document.getElementById('totalCarabao').textContent = totalCarabao;
        document.getElementById('totalWeight').textContent = totalWeight.toFixed(2) + ' kg';
    }

    // ========================================================================
    // LOAD TABLE
    // ========================================================================

    function loadTable(data = livestockData) {
        const tbody = document.getElementById('livestock-tbody');
        const emptyState = document.getElementById('emptyState');

        tbody.innerHTML = '';

        if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        data.forEach(record => {
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
                <button class="action-btn edit-btn" onclick="editLivestock('${record.livestockId}')">
                    <i class='bx bx-edit'></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="openDeleteModal('${record.livestockId}')">
                    <i class='bx bx-trash'></i> Delete
                </button>
            </td>
        `;
        
        return row;
    }

    // ========================================================================
    // ADD/EDIT LIVESTOCK
    // ========================================================================

    const formModal = document.getElementById('formModalOverlay');
    const formModalTitle = document.getElementById('formModalTitle');
    const livestockForm = document.getElementById('livestockForm');
    const addLivestockBtn = document.getElementById('addLivestockBtn');
    const formModalClose = document.getElementById('formModalClose');
    const cancelBtn = document.getElementById('cancelBtn');

    addLivestockBtn.addEventListener('click', () => {
        editingId = null;
        formModalTitle.textContent = 'Add New Livestock';
        livestockForm.reset();
        formModal.classList.add('active');
    });

    formModalClose.addEventListener('click', () => {
        formModal.classList.remove('active');
    });

    cancelBtn.addEventListener('click', () => {
        formModal.classList.remove('active');
    });

    formModal.addEventListener('click', (e) => {
        if (e.target === formModal) {
            formModal.classList.remove('active');
        }
    });

    window.editLivestock = function(livestockId) {
        const record = livestockData.find(l => l.livestockId === livestockId);
        if (!record) return;

        editingId = livestockId;
        formModalTitle.textContent = 'Edit Livestock';
        
        livestockForm.kindOfLivestock.value = record.kindOfLivestock;
        livestockForm.gender.value = record.gender;
        livestockForm.weight.value = record.weight;

        formModal.classList.add('active');
    };

    livestockForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(livestockForm);
        const data = {
            kindOfLivestock: formData.get('kindOfLivestock'),
            gender: formData.get('gender'),
            weight: parseFloat(formData.get('weight'))
        };

        if (editingId) {
            // Update existing
            const index = livestockData.findIndex(l => l.livestockId === editingId);
            if (index !== -1) {
                livestockData[index] = {
                    ...livestockData[index],
                    ...data,
                    lastModified: new Date().toISOString()
                };
            }
        } else {
            // Add new
            const newLivestock = {
                livestockId: generateLivestockId(),
                ...data,
                dealer: currentDealer.name,
                status: "In Entry Point",
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            livestockData.push(newLivestock);
        }

        formModal.classList.remove('active');
        updateStats();
        loadTable();
        applyTypeFilter();
    });

    // ========================================================================
    // DELETE LIVESTOCK
    // ========================================================================

    const deleteModal = document.getElementById('deleteModalOverlay');
    const deleteModalClose = document.getElementById('deleteModalClose');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    window.openDeleteModal = function(livestockId) {
        deletingId = livestockId;
        deleteModal.classList.add('active');
    };

    deleteModalClose.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
        }
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (deletingId) {
            livestockData = livestockData.filter(l => l.livestockId !== deletingId);
            deleteModal.classList.remove('active');
            updateStats();
            loadTable();
            applyTypeFilter();
        }
    });

    // ========================================================================
    // FILTERS
    // ========================================================================

    const typeFilter = document.getElementById('typeFilter');
    
    function applyTypeFilter() {
        const filterValue = typeFilter.value;
        let filtered = livestockData;

        if (filterValue !== 'all') {
            filtered = livestockData.filter(l => l.kindOfLivestock === filterValue);
        }

        loadTable(filtered);
    }

    typeFilter.addEventListener('change', applyTypeFilter);

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = livestockData.filter(record => 
                record.livestockId.toLowerCase().includes(searchTerm) ||
                record.kindOfLivestock.toLowerCase().includes(searchTerm) ||
                record.status.toLowerCase().includes(searchTerm)
            );
            loadTable(filtered);
        });
    }

    // ========================================================================
    // INITIALIZE
    // ========================================================================

    updateStats();
    loadTable();

    console.log('=== DEALER LIVESTOCK PAGE INITIALIZED ===');
});