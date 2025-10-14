// Sidebar active state
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach((item) => {
  const li = item.parentElement;
  item.addEventListener('click', function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove('active');
    });
    li.classList.add('active');
  });
});

// Toggle sidebar
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
menuBar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});

// Search in mobile
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

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

if (window.innerWidth < 768) {
  sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
});

/* ===========================
   Dark Mode (no flash + no transitions in dark)
   =========================== */
const switchMode = document.getElementById('switch-mode');

// Apply stored preference on load (match key used in HTML preloader)
(function applyStoredTheme() {
  const isDark = localStorage.getItem('dark-mode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    if (switchMode) switchMode.checked = true;
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    if (switchMode) switchMode.checked = false;
  }
})();

// Toggle with transition suppression
if (switchMode) {
  switchMode.addEventListener('change', function () {
    // Temporarily disable transitions while switching
    document.documentElement.classList.add('theme-changing');

    if (this.checked) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('dark-mode', 'false');
    }

    // Re-enable transitions after paint
    setTimeout(() => {
      document.documentElement.classList.remove('theme-changing');
    }, 0);
  });
}

/* ===========================
   User Management (unchanged)
   =========================== */
let admins = [
  { id: 'AD01', fullName: 'John Doe', username: 'admin1', role: 'Admin', password: 'admin123' },
  { id: 'AD02', fullName: 'Jane Smith', username: 'admin2', role: 'Admin', password: 'admin456' }
];

const adminForm = document.getElementById('adminForm');
const adminTable = document.querySelector('.admin-table');

function renderAdmins() {
  adminTable.innerHTML = '';

  const tableHeader = document.createElement('thead');
  tableHeader.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Password</th>
            <th>Action</th>
        </tr>
    `;
  adminTable.appendChild(tableHeader);

  const tableBody = document.createElement('tbody');
  admins.forEach((admin, index) => {
    const adminItem = document.createElement('tr');
    adminItem.classList.add('admin-item');
    adminItem.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.fullName}</td>
            <td>${admin.username}</td>
            <td>${admin.role}</td>
            <td class="password-cell">
              <span class="password-value">*******</span>
              <span class="actual-password" style="display:none;">${admin.password}</span>
              <i class='bx bx-show-alt toggle-password'></i>
            </td>
            <td>
              <span class="admin-delete" data-index="${index}">Delete Access <i class='bx bx-trash'></i></span>
            </td>
        `;
    tableBody.appendChild(adminItem);
  });
  adminTable.appendChild(tableBody);

  // Toggle password visibility
  adminTable.querySelectorAll('.toggle-password').forEach((toggleBtn) => {
    toggleBtn.addEventListener('click', function () {
      const passwordField = this.parentElement.querySelector('.password-value');
      const actualPasswordField = this.parentElement.querySelector('.actual-password');
      if (passwordField.style.display === 'none') {
        passwordField.style.display = 'inline';
        actualPasswordField.style.display = 'none';
        this.classList.replace('bx-hide', 'bx-show-alt');
      } else {
        passwordField.style.display = 'none';
        actualPasswordField.style.display = 'inline';
        this.classList.replace('bx-show-alt', 'bx-hide');
      }
    });
  });

  // Delete admin
  adminTable.querySelectorAll('.admin-delete').forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', function () {
      const index = this.parentElement.dataset.index;
      admins.splice(index, 1);
      renderAdmins();
    });
  });
}

renderAdmins();

// Profile (unchanged)
document.addEventListener('DOMContentLoaded', function () {
  let ProfileImg = document.getElementById('profile-img');
  let NavbarProfileImg = document.getElementById('navbar-profile-img');
  let insertFile = document.getElementById('insert-file');

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
        reader.onload = function (e) {
          let newImageSrc = e.target.result;
          updateProfileImages(newImageSrc);
        };
        reader.readAsDataURL(file);
      }
    };
  }
});
