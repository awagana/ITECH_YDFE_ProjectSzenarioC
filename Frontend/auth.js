let currentUser = "";
const API_URL = "http://127.0.0.1:5001/api";

async function handleRegister() {
    const user = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value;

    if(!user || !pass) return alert("Bitte alles ausfüllen!");

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: user, password: pass })
    });

    const result = await response.json();
    if(response.ok) {
        alert("Account erstellt!");
        showSection("login-form");
    } else {
        alert(result.error);
    }
}

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
        document.getElementById("nav-menu").style.display = "none";
        document.getElementById("welcome-text").innerHTML = `Bereit, <span style="color:#00f2ff">${currentUser}</span>?`;
        showSection("quiz-area");
        // Optional: Quiz-Daten jetzt erst laden
        // loadQuestionsFromServer(); 
    } else {
        alert(result.error);
    }
}

function logout() { location.reload(); }
