document.addEventListener("DOMContentLoaded", function() {
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

    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    });

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

    // Dark Mode
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

    // Profile

    // Toggle edit form visibility and button text
    function toggleEditForm() {
        const editForm = document.getElementById('editForm');
        const editButton = document.getElementById('editButton');
        const saveChangesButton = document.getElementById('saveChangesButton');

        if (editForm.style.display === 'none' || editForm.style.display === '') {
            editForm.style.display = 'block';
            editButton.style.display = 'none';
            saveChangesButton.style.display = 'inline-block';
        } else {
            editForm.style.display = 'none';
            editButton.style.display = 'inline-block';
            saveChangesButton.style.display = 'none';
        }
    }

    // Save changes function
    function saveChanges() {
        const fullName = document.getElementById('editFullName').value;
        const location = document.getElementById('editLocation').value;
        const phone = document.getElementById('editPhone').value;

        // Update displayed profile information
        document.getElementById('fullName').textContent = fullName;
        document.getElementById('fullName1').textContent = fullName;
        document.getElementById('location').textContent = location;
        document.getElementById('phone').textContent = phone;

        // Optional: Show a success message or perform additional actions after saving
        alert('Changes saved successfully.');

        // Hide the edit form and update button states
        toggleEditForm();
    }

    // Delete account function (placeholder)
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully.');
            window.location.href = 'sign.html';
        }
    }

// Event listener for edit password link
document.getElementById('editPassword').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link behavior
    toggleEditPasswordForm(); // Toggle display of edit password form or perform related actions
});

// Function to toggle edit password form visibility
function toggleEditPasswordForm() {
    const editPasswordForm = document.getElementById('editPasswordForm');
    if (editPasswordForm.style.display === 'none' || editPasswordForm.style.display === '') {
        editPasswordForm.style.display = 'block';
    } else {
        editPasswordForm.style.display = 'none';
    }
}

    // Event listener for edit button
    document.getElementById('editButton').addEventListener('click', function () {
        toggleEditForm();
    });

    // Event listener for save changes button
    document.getElementById('saveChangesButton').addEventListener('click', function () {
        saveChanges();
    });

    // Event listener for delete account button
    document.getElementById('deleteAccountButton').addEventListener('click', function () {
        deleteAccount();
    });

    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");

    // Function to update profile images
    function updateProfileImages(imageSrc) {
        ProfileImg.src = imageSrc;
        NavbarProfileImg.src = imageSrc;

        // Update profile image in localStorage
        localStorage.setItem('profileImage', imageSrc);

        // Update profile image in other pages if needed
        updateProfileImagesInOtherPages(imageSrc);
    }

    // Function to update profile image in other pages
    function updateProfileImagesInOtherPages(imageSrc) {
        // Example: Update profile image in other pages' navigation bars
        let navBarImages = document.querySelectorAll('.profile img');
        navBarImages.forEach(img => {
            img.src = imageSrc;
        });
    }
    document.getElementById("profile-btn").addEventListener("click", function(e) {
        e.stopPropagation();
        const dropdown = document.getElementById("profile-dropdown");
        dropdown.classList.toggle("active");
      });
      
    // Load saved image from localStorage on page load
    window.onload = function () {
        if (localStorage.getItem('profileImage')) {
            let savedImageSrc = localStorage.getItem('profileImage');
            updateProfileImages(savedImageSrc);
        }
    }

    // Handle file input change
    insertFile.onchange = function () {
        let file = insertFile.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let newImageSrc = e.target.result;
                updateProfileImages(newImageSrc);
            }
            reader.readAsDataURL(file);
        }
    }

    // Update initial sidebar state based on window width
    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }

    // Handle window resize event to adjust sidebar and search form visibility
    window.addEventListener('resize', function () {
        if (window.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
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
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    });
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
    const switchMode = document.getElementById('switch-mode');
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        switchMode.checked = true;
    } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        switchMode.checked = false;
    }
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dark-mode', 'false');
        }
    });
    function toggleEditForm() {
        const editForm = document.getElementById('editForm');
        const editButton = document.getElementById('editButton');
        const saveChangesButton = document.getElementById('saveChangesButton');
        if (editForm.style.display === 'none' || editForm.style.display === '') {
            editForm.style.display = 'block';
            editButton.style.display = 'none';
            saveChangesButton.style.display = 'inline-block';
        } else {
            editForm.style.display = 'none';
            editButton.style.display = 'inline-block';
            saveChangesButton.style.display = 'none';
        }
    }
    function saveChanges() {
        const fullName = document.getElementById('editFullName').value;
        const location = document.getElementById('editLocation').value;
        const phone = document.getElementById('editPhone').value;
        document.getElementById('fullName').textContent = fullName;
        document.getElementById('fullName1').textContent = fullName;
        document.getElementById('location').textContent = location;
        document.getElementById('phone').textContent = phone;
        alert('Changes saved successfully.');
        toggleEditForm();
    }
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully.');
            window.location.href = 'sign.html';
        }
    }
    document.getElementById('editPassword').addEventListener('click', function (event) {
        event.preventDefault();
        toggleEditPasswordForm();
    });
    function toggleEditPasswordForm() {
        const editPasswordForm = document.getElementById('editPasswordForm');
        if (editPasswordForm.style.display === 'none' || editPasswordForm.style.display === '') {
            editPasswordForm.style.display = 'block';
        } else {
            editPasswordForm.style.display = 'none';
        }
    }
    document.getElementById('editButton').addEventListener('click', function () {
        toggleEditForm();
    });
    document.getElementById('saveChangesButton').addEventListener('click', function () {
        saveChanges();
    });
    document.getElementById('deleteAccountButton').addEventListener('click', function () {
        deleteAccount();
    });
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");
    function updateProfileImages(imageSrc) {
        ProfileImg.src = imageSrc;
        NavbarProfileImg.src = imageSrc;
        localStorage.setItem('profileImage', imageSrc);
        updateProfileImagesInOtherPages(imageSrc);
    }
    function updateProfileImagesInOtherPages(imageSrc) {
        let navBarImages = document.querySelectorAll('.profile img');
        navBarImages.forEach(img => {
            img.src = imageSrc;
        });
    }
    document.getElementById("profile-btn").addEventListener("click", function(e) {
        e.stopPropagation();
        const dropdown = document.getElementById("profile-dropdown");
        dropdown.classList.toggle("active");
    });
    window.onload = function () {
        if (localStorage.getItem('profileImage')) {
            let savedImageSrc = localStorage.getItem('profileImage');
            updateProfileImages(savedImageSrc);
        }
    }
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
    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
    window.addEventListener('resize', function () {
        if (window.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
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
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    });
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
    const switchMode = document.getElementById('switch-mode');
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        switchMode.checked = true;
    } else {
        document.body.classList.remove('dark');
        document.documentElement.classList.remove('dark');
        switchMode.checked = false;
    }
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dark-mode', 'false');
        }
    });
    function toggleEditForm() {
        const editForm = document.getElementById('editForm');
        const editButton = document.getElementById('editButton');
        const saveChangesButton = document.getElementById('saveChangesButton');
        if (editForm.style.display === 'none' || editForm.style.display === '') {
            editForm.style.display = 'block';
            editButton.style.display = 'none';
            saveChangesButton.style.display = 'inline-block';
        } else {
            editForm.style.display = 'none';
            editButton.style.display = 'inline-block';
            saveChangesButton.style.display = 'none';
        }
    }
    function saveChanges() {
        const fullName = document.getElementById('editFullName').value;
        const location = document.getElementById('editLocation').value;
        const phone = document.getElementById('editPhone').value;
        document.getElementById('fullName').textContent = fullName;
        document.getElementById('fullName1').textContent = fullName;
        document.getElementById('location').textContent = location;
        document.getElementById('phone').textContent = phone;
        alert('Changes saved successfully.');
        toggleEditForm();
    }
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account?')) {
            alert('Account deleted successfully.');
            window.location.href = 'sign.html';
        }
    }
    document.getElementById('editPassword').addEventListener('click', function (event) {
        event.preventDefault();
        toggleEditPasswordForm();
    });
    function toggleEditPasswordForm() {
        const editPasswordForm = document.getElementById('editPasswordForm');
        if (editPasswordForm.style.display === 'none' || editPasswordForm.style.display === '') {
            editPasswordForm.style.display = 'block';
        } else {
            editPasswordForm.style.display = 'none';
        }
    }
    document.getElementById('editButton').addEventListener('click', function () {
        toggleEditForm();
    });
    document.getElementById('saveChangesButton').addEventListener('click', function () {
        saveChanges();
    });
    document.getElementById('deleteAccountButton').addEventListener('click', function () {
        deleteAccount();
    });
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");
    function updateProfileImages(imageSrc) {
        ProfileImg.src = imageSrc;
        NavbarProfileImg.src = imageSrc;
        localStorage.setItem('profileImage', imageSrc);
        updateProfileImagesInOtherPages(imageSrc);
    }
    function updateProfileImagesInOtherPages(imageSrc) {
        let navBarImages = document.querySelectorAll('.profile img');
        navBarImages.forEach(img => {
            img.src = imageSrc;
        });
    }
    document.getElementById("profile-btn").addEventListener("click", function(e) {
        e.stopPropagation();
        const dropdown = document.getElementById("profile-dropdown");
        dropdown.classList.toggle("active");
    });
    window.onload = function () {
        if (localStorage.getItem('profileImage')) {
            let savedImageSrc = localStorage.getItem('profileImage');
            updateProfileImages(savedImageSrc);
        }
    }
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
    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
    window.addEventListener('resize', function () {
        if (window.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });
});
// === THEME SWITCH (Unified, Flash-Free) ===
const switchMode = document.getElementById("switch-mode");
const root = document.documentElement;

// Load saved theme instantly
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  root.classList.add("dark");
  switchMode.checked = true;
} else {
  document.body.classList.remove("dark");
  root.classList.remove("dark");
  switchMode.checked = false;
}

// Toggle theme on switch
switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});
// === THEME SWITCH (Unified with records.html) ===
document.addEventListener("DOMContentLoaded", function () {
    const switchMode = document.getElementById("switch-mode");
    const root = document.documentElement;
    const body = document.body;
  
    function applyTheme(theme) {
      if (theme === "dark") {
        root.classList.add("dark");
        body.classList.add("dark");
        body.setAttribute("data-theme", "dark");
        if (switchMode) switchMode.checked = true;
      } else {
        root.classList.remove("dark");
        body.classList.remove("dark");
        body.removeAttribute("data-theme");
        if (switchMode) switchMode.checked = false;
      }
    }
  
    // Load saved
    const savedTheme = localStorage.getItem("theme");
    applyTheme(savedTheme === "dark" ? "dark" : "light");
  
    // Listen to toggle
    if (switchMode) {
      switchMode.addEventListener("change", function () {
        const next = this.checked ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem("theme", next);
      });
    }
  });
  