// SIDEBAR
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', () => {
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
    li.classList.add('active');
  });
});

const menuBar = document.querySelector('.bx.bx-menu');
const sidebar = document.getElementById('sidebar');
menuBar.addEventListener('click', () => sidebar.classList.toggle('hide'));

// THEME TOGGLE
const switchMode = document.getElementById('switch-mode');
if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark');
  switchMode.checked = true;
}
switchMode.addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
  localStorage.setItem('dark-mode', this.checked);
});

// PROFILE IMAGE SYNC
document.addEventListener("DOMContentLoaded", () => {
  let NavbarProfileImg = document.getElementById("navbar-profile-img");
  if (localStorage.getItem('profileImage'))
    NavbarProfileImg.src = localStorage.getItem('profileImage');
});

// LIVESTOCK RECORDS
$(document).ready(function() {
  const table = $('#livestockTable').DataTable({
    pageLength: 10,
    dom: 't<"bottom"ip>',
    columnDefs: [{ targets: 5, orderable: false }],
    language: { emptyTable: "No data available" }
  });

  $('#search').on('keyup', function() {
    table.search(this.value).draw();
  });

  $('#table_size').on('change', function() {
    table.page.len(this.value).draw();
  });
});

// FORM HANDLING
const registerLivestockBtn = document.getElementById('registerLivestockBtn');
const darkBg = document.querySelector('.dark_bg');
const popup = document.querySelector('.popup');
const closeBtn = document.querySelector('.closeBtn');
const cancelBtn = document.querySelector('.cancelBtn');
const form = document.getElementById('myForm');

registerLivestockBtn.addEventListener('click', () => {
  darkBg.classList.add('active');
  form.reset();
});
closeBtn.addEventListener('click', () => darkBg.classList.remove('active'));
cancelBtn.addEventListener('click', () => darkBg.classList.remove('active'));
darkBg.addEventListener('click', e => { if (e.target === darkBg) darkBg.classList.remove('active'); });

// QR SCANNER
const qrScanBtn = document.getElementById('qrScanBtn');
const qrBg = document.querySelector('.qr_scanner_bg');
const closeQRBtn = document.querySelector('.closeQRBtn');
qrScanBtn.addEventListener('click', () => {
  qrBg.classList.add('active');
  const qrScanner = new Html5Qrcode("qr-reader");
  qrScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    decodedText => {
      document.getElementById('livestockId').value = decodedText;
      alert("Scanned: " + decodedText);
      qrScanner.stop().then(() => qrBg.classList.remove('active'));
    }
  );
});
closeQRBtn.addEventListener('click', () => qrBg.classList.remove('active'));

// EXPORT FUNCTIONS
document.getElementById('exportPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Livestock Records Report', 14, 20);
  const rows = [];
  document.querySelectorAll('#livestockTable tbody tr').forEach(tr => {
    const data = Array.from(tr.children).slice(0,5).map(td => td.textContent);
    rows.push(data);
  });
  doc.autoTable({ head: [['ID','Type','Gender','Weight','Status']], body: rows });
  doc.save('livestock_records.pdf');
});

document.getElementById('exportExcel').addEventListener('click', () => {
  const ws = XLSX.utils.table_to_sheet(document.getElementById('livestockTable'));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Records");
  XLSX.writeFile(wb, 'livestock_records.xlsx');
});

// EXPORT MENU
$('.exportBtn').on('click', function(e) {
  e.stopPropagation();
  $('.exportOptions').slideToggle(200);
});
$(document).on('click', e => {
  if (!$(e.target).closest('.exportMenu').length) $('.exportOptions').slideUp(200);
});
