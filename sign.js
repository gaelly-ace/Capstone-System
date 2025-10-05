document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const loginFormElement = document.getElementById('loginForm');

    loginFormElement.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginFormElement.querySelector('input[name="username"]').value;
        const password = loginFormElement.querySelector('input[name="password"]').value;

        if (username && password) {
            console.log('Login form is valid');
            window.location.href = 'index.html'; // Adjust this URL as needed
        } else {
            alert('Please fill in all fields');
        }
    });
});
