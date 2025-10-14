/* ================================
   SIDEBAR & NAVBAR FUNCTIONALITY
================================ */
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', () => {
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
    li.classList.add('active');
  });
});

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', () => {
  sidebar.classList.toggle('hide');
});

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', e => {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle('show');
    searchButtonIcon.classList.toggle('bx-x');
    searchButtonIcon.classList.toggle('bx-search');
  }
});

if (window.innerWidth < 768) sidebar.classList.add('hide');
else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
});

/* ================================
   DARK MODE SWITCH
================================ */
const switchMode = document.getElementById('switch-mode');
const body = document.body;
const html = document.documentElement;

if (localStorage.getItem('dark-mode') === 'true') {
  body.classList.add('dark');
  html.classList.add('dark');
  switchMode.checked = true;
}

switchMode.addEventListener('change', () => {
  const isDark = switchMode.checked;
  body.classList.toggle('dark', isDark);
  html.classList.toggle('dark', isDark);
  localStorage.setItem('dark-mode', isDark);
});

/* ================================
   PROFILE IMAGE LOAD / SAVE
================================ */
document.addEventListener('DOMContentLoaded', () => {
  const profileImg = document.getElementById('profile-img');
  const navbarImg = document.getElementById('navbar-profile-img');
  const insertFile = document.getElementById('insert-file');

  function updateProfileImages(src) {
    if (profileImg) profileImg.src = src;
    if (navbarImg) navbarImg.src = src;
    localStorage.setItem('profileImage', src);
  }

  const saved = localStorage.getItem('profileImage');
  if (saved) updateProfileImages(saved);

  if (insertFile) {
    insertFile.onchange = () => {
      const file = insertFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => updateProfileImages(e.target.result);
      reader.readAsDataURL(file);
    };
  }
});

/* ================================
   ARCHIVES MANAGEMENT
================================ */
document.addEventListener('DOMContentLoaded', () => {
  // DOM references
  const clearAllBtn = document.getElementById('clearAllBtn');
  const entries = document.querySelector('.showEntries');
  const tableSize = document.getElementById('table_size');
  const userInfo = document.querySelector('.userInfo');
  const searchInput = document.getElementById('search');

  // Confirmation modal
  const modalBg = document.querySelector('.confirmation_bg');
  const confirmPopup = document.querySelector('.confirmation_popup');
  const closeBtn = document.querySelector('.closeConfirmBtn');
  const cancelBtn = document.querySelector('.cancelConfirmBtn');
  const confirmBtn = document.querySelector('.confirmBtn');
  const confirmMsg = document.getElementById('confirmationMessage');

  // Data setup
  let archivedData = JSON.parse(localStorage.getItem('archivedLivestockRecords')) || [];
  let filteredData = [...archivedData];
  let currentIndex = 1;
  let tableLimit = 10;
  let maxIndex = 0;
  let currentAction = null;
  let targetRecordId = null;

  /* ---------- Utility Functions ---------- */
  function calcPagination() {
    maxIndex = Math.ceil(filteredData.length / tableLimit);
  }

  function updateEntriesDisplay() {
    const total = filteredData.length;
    const start = (currentIndex - 1) * tableLimit + 1;
    const end = Math.min(start + tableLimit - 1, total);
    entries.textContent = total
      ? `Showing ${start} to ${end} of ${total} entries`
      : 'Showing 0 to 0 of 0 entries';
  }

  function showRecords() {
    userInfo.innerHTML = '';
    if (filteredData.length === 0) {
      userInfo.innerHTML =
        '<tr><td class="empty" colspan="7" align="center">No archived records available</td></tr>';
      return;
    }

    const start = (currentIndex - 1) * tableLimit;
    const end = start + tableLimit;
    const visible = filteredData.slice(start, end);

    visible.forEach(rec => {
      const date = rec.archivedDate
        ? new Date(rec.archivedDate).toLocaleDateString()
        : 'N/A';
      userInfo.innerHTML += `
        <tr>
          <td>${rec.livestockId}</td>
          <td>${rec.kindOfLivestock}</td>
          <td>${rec.gender}</td>
          <td>${rec.weight} kg</td>
          <td>${rec.status}</td>
          <td class="archived-date">${date}</td>
          <td><button class="unarchiveBtn" onclick="archivesApp.unarchiveRecord('${rec.livestockId}')">Unarchive</button></td>
        </tr>`;
    });
  }

  function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
      <button onclick="prev()" class="prev">Prev</button>
      ${Array.from({ length: maxIndex }, (_, i) => `<button onclick="paginationBtn(${i + 1})" index="${i + 1}">${i + 1}</button>`).join('')}
      <button onclick="next()" class="next">Next</button>`;
    highlightActivePage();
  }

  function highlightActivePage() {
    updateEntriesDisplay();
    document.querySelectorAll('.pagination button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('index') == currentIndex);
    });
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    prev.classList.toggle('act', currentIndex > 1);
    next.classList.toggle('act', currentIndex < maxIndex);
  }

  /* ---------- Modal Control ---------- */
  function showModal(message, action, id = null) {
    confirmMsg.textContent = message;
    currentAction = action;
    targetRecordId = id;
    modalBg.classList.add('active');
  }

  function hideModal() {
    modalBg.classList.remove('active');
    currentAction = null;
    targetRecordId = null;
  }

  /* ---------- Main Actions ---------- */
  function unarchiveRecord(id) {
    showModal(
      'Are you sure you want to unarchive this record? It will be restored to active records.',
      'unarchive',
      id
    );
  }

  function clearAllArchives() {
    if (archivedData.length === 0) return alert('No archived records to clear.');
    showModal(
      'Are you sure you want to permanently delete all archived records? This action cannot be undone.',
      'clearAll'
    );
  }

  function executeAction() {
    if (currentAction === 'unarchive' && targetRecordId) {
      const index = archivedData.findIndex(r => r.livestockId === targetRecordId);
      if (index === -1) return;

      const record = archivedData[index];
      delete record.archivedDate;

      const active = JSON.parse(localStorage.getItem('livestockRecords')) || [];
      if (active.some(r => r.livestockId === record.livestockId)) {
        alert('A record with this ID already exists in active records!');
        hideModal();
        return;
      }

      active.push(record);
      archivedData.splice(index, 1);
      localStorage.setItem('livestockRecords', JSON.stringify(active));
      localStorage.setItem('archivedLivestockRecords', JSON.stringify(archivedData));

      filteredData = [...archivedData];
      currentIndex = Math.min(currentIndex, Math.ceil(filteredData.length / tableLimit)) || 1;

      refreshTable();
      alert('Record has been successfully restored!');
    }

    if (currentAction === 'clearAll') {
      archivedData = [];
      filteredData = [];
      localStorage.setItem('archivedLivestockRecords', JSON.stringify([]));
      currentIndex = 1;
      refreshTable();
      alert('All archived records have been permanently deleted!');
    }

    hideModal();
  }

  /* ---------- Utility Refresh ---------- */
  function refreshTable() {
    calcPagination();
    showRecords();
    renderPagination();
  }

  /* ---------- Pagination Controls ---------- */
  window.prev = () => {
    if (currentIndex > 1) {
      currentIndex--;
      refreshTable();
    }
  };

  window.next = () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      refreshTable();
    }
  };

  window.paginationBtn = index => {
    currentIndex = index;
    refreshTable();
  };

  /* ---------- Event Listeners ---------- */
  clearAllBtn.addEventListener('click', clearAllArchives);
  closeBtn.addEventListener('click', hideModal);
  cancelBtn.addEventListener('click', hideModal);
  confirmBtn.addEventListener('click', executeAction);
  modalBg.addEventListener('click', e => e.target === modalBg && hideModal());

  tableSize.addEventListener('change', e => {
    tableLimit = parseInt(e.target.value);
    currentIndex = 1;
    refreshTable();
  });

  searchInput.addEventListener('keyup', e => {
    const q = e.target.value.trim().toLowerCase();
    filteredData = q
      ? archivedData.filter(item =>
          ['livestockId', 'kindOfLivestock', 'gender', 'weight', 'status']
            .some(key => item[key]?.toString().toLowerCase().includes(q))
        )
      : [...archivedData];
    currentIndex = 1;
    refreshTable();
  });

  /* ---------- Export Functions ---------- */
  document.getElementById('exportPDF').addEventListener('click', () => {
    if (!archivedData.length) return alert('No archived records to export.');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(18).text('Archived Livestock Records', 14, 20);
    doc.setFontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    const data = archivedData.map(r => [
      r.livestockId,
      r.kindOfLivestock,
      r.gender,
      `${r.weight} kg`,
      r.status,
      r.archivedDate ? new Date(r.archivedDate).toLocaleDateString() : 'N/A'
    ]);
    doc.autoTable({
      head: [['ID', 'Type', 'Gender', 'Weight', 'Status', 'Archived Date']],
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [66, 69, 73], textColor: 255 },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    doc.save(`archived_records_${new Date().toISOString().split('T')[0]}.pdf`);
  });

  document.getElementById('exportExcel').addEventListener('click', () => {
    if (!archivedData.length) return alert('No archived records to export.');
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      archivedData.map(r => ({
        'Livestock ID': r.livestockId,
        'Kind': r.kindOfLivestock,
        'Gender': r.gender,
        'Weight (kg)': r.weight,
        'Status': r.status,
        'Archived Date': r.archivedDate
          ? new Date(r.archivedDate).toLocaleDateString()
          : 'N/A'
      }))
    );
    ws['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Archived Records');
    XLSX.writeFile(wb, `archived_records_${new Date().toISOString().split('T')[0]}.xlsx`);
  });

  /* ---------- Init Page ---------- */
  function init() {
    calcPagination();
    refreshTable();
  }

  init();

  // Expose for inline onclick
  window.archivesApp = { unarchiveRecord };
});
