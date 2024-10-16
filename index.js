function blog() {
        window.location.href = 'blogs.html';
}

function back() {
        window.location.href = 'blogs.html';
}
document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        alert('Access Denied to see source code !! ');
}, false);

function toggleMenu() {
        const navLinks = document.getElementById("navLinks");
        if (navLinks.style.display === "flex") {
            navLinks.style.display = "none";
        } else {
            navLinks.style.display = "flex";
        }
    }
    
