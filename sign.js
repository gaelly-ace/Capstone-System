document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const loginFormElement = document.getElementById('loginForm');
    const usernameInput = loginFormElement.querySelector('input[name="username"]');
    const passwordInput = loginFormElement.querySelector('input[name="password"]');

    // Real-time validation for username
    usernameInput.addEventListener('blur', function() {
        validateUsername();
    });

    // Real-time validation for password
    passwordInput.addEventListener('blur', function() {
        validatePassword();
    });

    // Clear error on input
    usernameInput.addEventListener('input', function() {
        clearError(usernameInput);
    });

    passwordInput.addEventListener('input', function() {
        clearError(passwordInput);
    });

    loginFormElement.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();

        if (isUsernameValid && isPasswordValid) {
            console.log('Login form is valid');
            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Redirect after a short delay
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        }
    });

    function validateUsername() {
        const username = usernameInput.value.trim();
        
        // Remove existing error
        clearError(usernameInput);

        if (username === '') {
            showError(usernameInput, 'Username is required');
            return false;
        } else if (username.length < 3) {
            showError(usernameInput, 'Username must be at least 3 characters');
            return false;
        } else if (username.length > 20) {
            showError(usernameInput, 'Username must be less than 20 characters');
            return false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            showError(usernameInput, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        // Remove existing error
        clearError(passwordInput);

        if (password === '') {
            showError(passwordInput, 'Password is required');
            return false;
        } else if (password.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            return false;
        } else if (password.length > 30) {
            showError(passwordInput, 'Password must be less than 30 characters');
            return false;
        } else if (!/(?=.*[a-z])/.test(password)) {
            showError(passwordInput, 'Password must contain at least one lowercase letter');
            return false;
        } else if (!/(?=.*[A-Z])/.test(password)) {
            showError(passwordInput, 'Password must contain at least one uppercase letter');
            return false;
        } else if (!/(?=.*\d)/.test(password)) {
            showError(passwordInput, 'Password must contain at least one number');
            return false;
        }
        
        return true;
    }

    function showError(input, message) {
        const inputBox = input.parentElement;
        
        // Check if error message already exists
        let errorElement = inputBox.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            inputBox.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderBottomColor = '#ff3860';
    }

    function clearError(input) {
        const inputBox = input.parentElement;
        const errorElement = inputBox.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderBottomColor = '#fff';
    }

    function showSuccess(message) {
        // Remove existing success message if any
        const existingSuccess = document.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }

        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        loginFormElement.appendChild(successElement);

        // Remove success message after 3 seconds
        setTimeout(function() {
            successElement.remove();
        }, 3000);
    }
});