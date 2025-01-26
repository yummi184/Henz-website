function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Ensure the menu closes when clicking outside of it
document.addEventListener('click', function(e) {
    const menu = document.getElementById('menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (e.target !== menu && e.target !== hamburger) {
        menu.style.display = 'none';
    }
});

document.querySelector('form').onsubmit = function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'henztech£@#') {
        alert('Login Successful!');
        window.location.href = 'dashboard.html';  // Redirect to admin dashboard
    } else {
        alert('Incorrect Username or Password');
    }
};
