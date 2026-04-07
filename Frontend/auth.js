// WICHTIG: Beim Laden der Seite schauen, ob wir noch eingeloggt sind
let currentUser = sessionStorage.getItem("quiz_user") || "";
const API_URL = "http://127.0.0.1:5001/api";

// Automatischer Login-Check beim Start
window.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        // Wenn User gefunden, direkt ins Quiz-Interface
        document.getElementById("nav-menu").style.display = "none";
        document.getElementById("welcome-text").innerHTML = `Bereit, <span style="color:#00f2ff">${currentUser}</span>?`;
        showSection("quiz-area");
    }
});

async function handleLogin() {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: user, password: pass })
    });

    const result = await response.json();
    if(response.ok) {
        currentUser = result.user.username;
        // PERSISTENZ: Hier merken wir uns den User!
        sessionStorage.setItem("quiz_user", currentUser); 

        document.getElementById("nav-menu").style.display = "none";
        document.getElementById("welcome-text").innerHTML = `Bereit, <span style="color:#00f2ff">${currentUser}</span>?`;
        showSection("quiz-area");
    } else {
        alert(result.error);
    }
}

function logout() { 
    sessionStorage.removeItem("quiz_user");
    location.reload(); 
}

// handleRegister bleibt gleich...
async function handleRegister() {
    const user = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: user, password: pass })
    });
    if(response.ok) { alert("Account erstellt!"); showSection("login-form"); }
    else { const res = await response.json(); alert(res.error); }
}