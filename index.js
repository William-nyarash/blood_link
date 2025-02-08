document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.querySelector(".login_btn");
    const regBtn = document.querySelector(".reg_btn");
    const loginForm = document.getElementById("loginForm");
    const regForm = document.getElementById("registerForm");

    loginForm.style.display = "none";
    regForm.style.display = "none";
    const base_url = "http://localhost:3001/";  // Your backend URL

    // Show login form when 'Login' button is clicked
    loginBtn.addEventListener("click", function() {
        regForm.style.display = "none";
        loginForm.style.display = "block";
    });

    // Show registration form when 'Register' button is clicked
    regBtn.addEventListener("click", function() {
        loginForm.style.display = "none";
        regForm.style.display = "block";
    });

    // Handle register form submission via AJAX
    regForm.addEventListener("submit", function(e) {
        e.preventDefault();  // Prevent the default form submission

        const formData = new FormData(regForm);

        // Convert FormData to an object for JSON conversion
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Send the registration data to the backend
        fetch(base_url + 'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Sending as JSON
            },
            body: JSON.stringify(formObject)  // Convert the form data to JSON
        })
        .then(response => response.json())  // Parse the JSON response from the server
        .then(data => {
            if (data.message === "User registered successfully") {
                // Redirect to home page after successful registration
                window.location.href = '/home.html';
            } else {
                alert('Registration failed! Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    // Handle login form submission via AJAX
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();  // Prevent the default form submission

        const username = loginForm.username.value;  // Get username from the form
        const password = loginForm.password.value;  // Get password from the form

        const credentials = {
            username,
            password
        };

        // Send the login credentials to the backend
        fetch(base_url + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Indicate that the body is JSON
            },
            body: JSON.stringify(credentials)  // Send username and password as JSON
        })
        .then(response => response.json())  // Parse the JSON response from the server
        .then(data => {
            if (data.token) {
                // If login is successful, store the JWT token in localStorage
                localStorage.setItem('authToken', data.token);

                // Redirect to home page after successful login
                window.location.href = '/home.html';
            } else {
                // If login failed, show an alert
                alert('Login failed! Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
