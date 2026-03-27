let currentUser = "";

function handleRegister() {
    const user = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value;
    if(user && pass) {
        if(localStorage.getItem(`user_${user}`)) return alert("Name vergeben!");
        localStorage.setItem(`user_${user}`, JSON.stringify({pass, scores: {}, played: 0}));
        alert("Account erstellt!");
        showSection("login-form");
    }
}

function handleLogin() {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const data = JSON.parse(localStorage.getItem(`user_${user}`));
    if(data && data.pass === pass) {
        currentUser = user;
        document.getElementById("nav-menu").style.display = "none";
        document.getElementById("welcome-text").innerHTML = `Bereit, <span style="color:#00f2ff">${user}</span>?`;
        showSection("quiz-area");
    } else alert("Fehler beim Login!");
}

function logout() { location.reload(); }