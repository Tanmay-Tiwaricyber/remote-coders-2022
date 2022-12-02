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