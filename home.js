document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function() {
        // Here you can clear the session (localStorage, sessionStorage, or cookies)
        // Example:
        // localStorage.removeItem('userSession');
        
        // Redirect to login page
        window.location.href = '/login.html';
    });
});
