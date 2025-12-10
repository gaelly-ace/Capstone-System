// ============================================================================
// DEALER PROFILE PAGE
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEALER PROFILE PAGE STARTING ===');

    // Get current dealer info
    const currentDealer = {
        id: localStorage.getItem('dealerId') || 'DEALER-001',
        name: localStorage.getItem('dealerName') || 'Juan Dela Cruz',
        email: localStorage.getItem('dealerEmail') || 'juan.delacruz@example.com',
        phone: localStorage.getItem('dealerPhone') || '+63 912 345 6789',
        address: localStorage.getItem('dealerAddress') || 'Santa Rosa, Laguna',
        businessName: localStorage.getItem('dealerBusinessName') || 'JDC Livestock Trading',
        memberSince: localStorage.getItem('dealerMemberSince') || 'Nov 2024'
    };

    // Sample statistics
    const stats = {
        totalLivestock: 15,
        completed: 8
    };

    // ========================================================================
    // LOAD PROFILE DATA
    // ========================================================================

    function loadProfileData() {
        // Profile card
        document.getElementById('profileName').textContent = currentDealer.name;
        
        // Stats
        document.getElementById('statTotalLivestock').textContent = stats.totalLivestock;
        document.getElementById('statCompleted').textContent = stats.completed;
        document.getElementById('statMemberSince').textContent = currentDealer.memberSince;

        // Info
        document.getElementById('infoFullName').textContent = currentDealer.name;
        document.getElementById('infoEmail').textContent = currentDealer.email;
        document.getElementById('infoPhone').textContent = currentDealer.phone;
        document.getElementById('infoAddress').textContent = currentDealer.address;
        document.getElementById('infoBusinessName').textContent = currentDealer.businessName;
        document.getElementById('infoDealerId').textContent = currentDealer.id;
    }

    // ========================================================================
    // PROFILE IMAGE UPLOAD
    // ========================================================================

    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');

    profileImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
                
                // Save to localStorage
                const profileData = {
                    src: event.target.result
                };
                localStorage.setItem('dealerProfileImage', JSON.stringify(profileData));
                
                // Update navbar image
                const navbarImg = document.getElementById('navbar-profile-img');
                if (navbarImg) {
                    navbarImg.src = event.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved profile image
    const savedProfileData = localStorage.getItem('dealerProfileImage');
    if (savedProfileData) {
        try {
            const profileData = JSON.parse(savedProfileData);
            profileImage.src = profileData.src;
        } catch (e) {
            console.error('Error loading profile image:', e);
        }
    }

    // ========================================================================
    // EDIT PROFILE MODAL
    // ========================================================================

    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileClose = document.getElementById('editProfileClose');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileBtn.addEventListener('click', () => {
        // Pre-fill form
        editProfileForm.fullName.value = currentDealer.name;
        editProfileForm.email.value = currentDealer.email;
        editProfileForm.phone.value = currentDealer.phone;
        editProfileForm.address.value = currentDealer.address;
        editProfileForm.businessName.value = currentDealer.businessName;

        editProfileModal.classList.add('active');
    });

    editProfileClose.addEventListener('click', () => {
        editProfileModal.classList.remove('active');
    });

    cancelEditBtn.addEventListener('click', () => {
        editProfileModal.classList.remove('active');
    });

    editProfileModal.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            editProfileModal.classList.remove('active');
        }
    });

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(editProfileForm);

        // Update current dealer info
        currentDealer.name = formData.get('fullName');
        currentDealer.email = formData.get('email');
        currentDealer.phone = formData.get('phone');
        currentDealer.address = formData.get('address');
        currentDealer.businessName = formData.get('businessName');

        // Save to localStorage
        localStorage.setItem('dealerName', currentDealer.name);
        localStorage.setItem('dealerEmail', currentDealer.email);
        localStorage.setItem('dealerPhone', currentDealer.phone);
        localStorage.setItem('dealerAddress', currentDealer.address);
        localStorage.setItem('dealerBusinessName', currentDealer.businessName);

        // Reload profile data
        loadProfileData();

        // Update dealer name in navbar if present
        const dealerNameEl = document.getElementById('dealerName');
        if (dealerNameEl) {
            dealerNameEl.textContent = currentDealer.name;
        }

        editProfileModal.classList.remove('active');
        alert('Profile updated successfully!');
    });

    // ========================================================================
    // CHANGE PASSWORD MODAL
    // ========================================================================

    const changePasswordModal = document.getElementById('changePasswordModal');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordClose = document.getElementById('changePasswordClose');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const changePasswordForm = document.getElementById('changePasswordForm');

    changePasswordBtn.addEventListener('click', () => {
        changePasswordForm.reset();
        changePasswordModal.classList.add('active');
    });

    changePasswordClose.addEventListener('click', () => {
        changePasswordModal.classList.remove('active');
    });

    cancelPasswordBtn.addEventListener('click', () => {
        changePasswordModal.classList.remove('active');
    });

    changePasswordModal.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            changePasswordModal.classList.remove('active');
        }
    });

    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(changePasswordForm);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        // In production, this would call an API
        // For now, just show success message
        changePasswordModal.classList.remove('active');
        alert('Password changed successfully!');
        changePasswordForm.reset();
    });

    // ========================================================================
    // INITIALIZE
    // ========================================================================

    loadProfileData();

    console.log('=== DEALER PROFILE PAGE INITIALIZED ===');
});