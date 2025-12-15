document.addEventListener("DOMContentLoaded", function() {
    console.log('=== PROFILE.JS STARTING ===');
    
    // SIDEBAR MENU ACTIVE STATE
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

    // TOGGLE SIDEBAR - Main functionality
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    console.log('Menu Bar found:', !!menuBar);
    console.log('Sidebar found:', !!sidebar);

    if (menuBar && sidebar) {
        // Remove any existing click listeners by cloning
        const newMenuBar = menuBar.cloneNode(true);
        menuBar.parentNode.replaceChild(newMenuBar, menuBar);
        
        newMenuBar.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Menu clicked! Current classes:', sidebar.className);
            sidebar.classList.toggle('hide');
            console.log('After toggle:', sidebar.className);
        });
        console.log('Sidebar toggle listener attached successfully');
    } else {
        console.error('CRITICAL: Menu bar or sidebar not found!');
    }

    // SEARCH FORM TOGGLE
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    if (searchButton && searchButtonIcon && searchForm) {
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

    // INITIAL SIDEBAR STATE
    if (sidebar && window.innerWidth < 768) {
        sidebar.classList.add('hide');
    }
    
    if (searchButtonIcon && searchForm && window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }

    // WINDOW RESIZE HANDLER
    window.addEventListener('resize', function () {
        if (this.innerWidth > 576 && searchButtonIcon && searchForm) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });

    // DARK MODE - Using localStorage
    const switchMode = document.getElementById('switch-mode');

    if (switchMode) {
        // Check stored preference on page load
        const darkMode = localStorage.getItem('darkMode') || localStorage.getItem('dark-mode');
        if (darkMode === 'enabled' || darkMode === 'true') {
            document.body.classList.add('dark');
            switchMode.checked = true;
        }

        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
                localStorage.setItem('dark-mode', 'true');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
                localStorage.setItem('dark-mode', 'false');
            }
        });
    }

    // PROFILE FUNCTIONS

    // Toggle edit form visibility
    function toggleEditForm() {
        const editForm = document.getElementById('editForm');
        const editButton = document.getElementById('editButton');
        const saveChangesButton = document.getElementById('saveChangesButton');

        if (editForm && editButton && saveChangesButton) {
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
    }

    // Save changes function
    function saveChanges() {
        const fullName = document.getElementById('editFullName').value;
        const location = document.getElementById('editLocation').value;
        const phone = document.getElementById('editPhone').value;
        const password = document.getElementById('editPassword').value;

        // Update displayed profile information
        const fullNameEl = document.getElementById('fullName');
        const fullName1El = document.getElementById('fullName1');
        const locationEl = document.getElementById('location');
        const phoneEl = document.getElementById('phone');

        if (fullNameEl) fullNameEl.textContent = fullName;
        if (fullName1El) fullName1El.textContent = fullName;
        if (locationEl) locationEl.textContent = location;
        if (phoneEl) phoneEl.textContent = phone;

        // Store admin name in localStorage
        localStorage.setItem('adminName', fullName);

        // Show success message
        if (password) {
            alert('Profile updated successfully, including password change.');
        } else {
            alert('Profile updated successfully.');
        }

        // Hide the edit form
        toggleEditForm();
    }

    // Delete account function
    function deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted successfully.');
            window.location.href = 'admin_sign.html';
        }
    }

    // Event listeners for buttons
    const editButton = document.getElementById('editButton');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const deleteAccountButton = document.getElementById('deleteAccountButton');

    if (editButton) {
        editButton.addEventListener('click', function (e) {
            e.preventDefault();
            toggleEditForm();
        });
    }

    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', function (e) {
            e.preventDefault();
            saveChanges();
        });
    }

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function (e) {
            e.preventDefault();
            deleteAccount();
        });
    }

    // PROFILE IMAGE HANDLING
    const ProfileImg = document.getElementById("profile-img");
    const NavbarProfileImg = document.getElementById("navbar-profile-img");
    const insertFile = document.getElementById("insert-file");

    console.log('Profile Image Elements:');
    console.log('- ProfileImg:', !!ProfileImg);
    console.log('- NavbarProfileImg:', !!NavbarProfileImg);
    console.log('- insertFile:', !!insertFile);

    // Function to update profile images
    function updateProfileImages(imageSrc) {
        console.log('Updating profile images with:', imageSrc.substring(0, 50) + '...');
        
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
            console.log('Updated profile-img');
        } else {
            console.warn('profile-img element not found');
        }
        
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
            console.log('Updated navbar-profile-img');
        } else {
            console.warn('navbar-profile-img element not found');
        }

        // Store in localStorage
        const profileImageData = {
            src: imageSrc,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('adminProfileImage', JSON.stringify(profileImageData));
        // Also store in profileImage for compatibility
        localStorage.setItem('profileImage', JSON.stringify(profileImageData));
        console.log('Saved to localStorage');
    }

    // Load saved image from localStorage on page load
    console.log('Loading saved profile image...');
    let storedProfileData = localStorage.getItem('adminProfileImage');
    if (!storedProfileData) {
        storedProfileData = localStorage.getItem('profileImage');
        console.log('Using fallback profileImage from localStorage');
    }
    
    if (storedProfileData) {
        try {
            const profileData = JSON.parse(storedProfileData);
            console.log('Found stored profile image, updating...');
            updateProfileImages(profileData.src);
        } catch (e) {
            console.error('Error loading admin profile image:', e);
        }
    } else {
        console.log('No stored profile image found');
    }

    // Load saved admin name
    const savedAdminName = localStorage.getItem('adminName');
    if (savedAdminName) {
        console.log('Loading saved admin name:', savedAdminName);
        const fullNameSpan = document.getElementById('fullName');
        const fullName1Span = document.getElementById('fullName1');
        const editFullNameInput = document.getElementById('editFullName');
        
        if (fullNameSpan) fullNameSpan.textContent = savedAdminName;
        if (fullName1Span) fullName1Span.textContent = savedAdminName;
        if (editFullNameInput) editFullNameInput.value = savedAdminName;
    }

    // Handle file input change
    if (insertFile) {
        insertFile.onchange = function () {
            console.log('File selected');
            let file = insertFile.files[0];
            if (file) {
                console.log('Reading file:', file.name);
                let reader = new FileReader();
                reader.onload = function (e) {
                    let newImageSrc = e.target.result;
                    console.log('File loaded, updating images');
                    updateProfileImages(newImageSrc);
                }
                reader.onerror = function(e) {
                    console.error('Error reading file:', e);
                }
                reader.readAsDataURL(file);
            }
        }
        console.log('File input listener attached');
    } else {
        console.warn('insert-file element not found');
    }

    // Make functions globally accessible
    window.toggleEditForm = toggleEditForm;
    window.saveChanges = saveChanges;
    window.deleteAccount = deleteAccount;
    
    console.log('=== PROFILE.JS INITIALIZED SUCCESSFULLY ===');
});