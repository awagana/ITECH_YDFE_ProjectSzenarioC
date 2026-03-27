let currentUser = "";
let currentQuestionIndex = 0;
let score = 0;
let currentCategory = "";

const quizData = {
    "Allgemeinwissen": [
        { q: "Was ist die Hauptstadt von Frankreich?", a: [{t: "Paris", c: true}, {t: "Marseille", c: false}] },
        { q: "Wie viele Planeten hat unser Sonnensystem?", a: [{t: "8", c: true}, {t: "9", c: false}] },
        { q: "Welches Metall ist bei Raumtemperatur flüssig?", a: [{t: "Quecksilber", c: true}, {t: "Blei", c: false}] }
    ],
    "Programmierung": [
        { q: "Wofür steht CSS?", a: [{t: "Cascading Style Sheets", c: true}, {t: "Computer Style System", c: false}] },
        { q: "Welches Zeichen leitet eine ID in CSS ein?", a: [{t: "#", c: true}, {t: ".", c: false}] },
        { q: "Welche Sprache wird für Web-Logik genutzt?", a: [{t: "JavaScript", c: true}, {t: "HTML", c: false}] }
    ],
    "Gaming": [
        { q: "Wer ist die Hauptfigur in 'The Legend of Zelda'?", a: [{t: "Link", c: true}, {t: "Zelda", c: false}] },
        { q: "In welchem Jahr erschien Minecraft?", a: [{t: "2011", c: true}, {t: "2009", c: false}] },
        { q: "Welches Studio entwickelte 'The Witcher'?", a: [{t: "CD Projekt Red", c: true}, {t: "Ubisoft", c: false}] }
    ]
};

function showSection(id) {
    document.querySelectorAll(".glass-card").forEach(c => c.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    
    if(id === 'login-form' || id === 'register-form') {
        document.getElementById("nav-login").classList.toggle("active", id === 'login-form');
        document.getElementById("nav-register").classList.toggle("active", id === 'register-form');
    }
}

function showSubView(viewId) {
    document.querySelectorAll(".sub-view").forEach(v => v.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
    if(viewId === 'category-selection' || viewId === 'leaderboard-category-select') initCategoryMenus();
}

// Erstellt die Buttons für die Kategorien dynamisch
function initCategoryMenus() {
    const playContainer = document.getElementById("category-buttons");
    const leadContainer = document.getElementById("leaderboard-cat-buttons");
    playContainer.innerHTML = "";
    leadContainer.innerHTML = "";

    Object.keys(quizData).forEach(cat => {
        // Buttons fürs Spielen
        let btnPlay = document.createElement("button");
        btnPlay.className = "btn btn-secondary";
        btnPlay.innerText = cat;
        btnPlay.onclick = () => startQuiz(cat);
        playContainer.appendChild(btnPlay);

        // Buttons fürs Leaderboard
        let btnLead = document.createElement("button");
        btnLead.className = "btn btn-secondary";
        btnLead.innerText = cat;
        btnLead.onclick = () => showLeaderboard(cat);
        leadContainer.appendChild(btnLead);
    });
}

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

function startQuiz(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    showSubView("question-container");
    showQuestion();
}

function showQuestion() {
    const btnContainer = document.getElementById("answer-buttons");
    btnContainer.innerHTML = "";
    const q = quizData[currentCategory][currentQuestionIndex];
    document.getElementById("question").innerText = q.q;

    q.a.forEach(ans => {
        const btn = document.createElement("button");
        btn.innerText = ans.t;
        btn.className = "btn btn-secondary";
        btn.onclick = () => {
            if(ans.c) score++;
            currentQuestionIndex++;
            if(currentQuestionIndex < quizData[currentCategory].length) showQuestion();
            else finishQuiz();
        };
        btnContainer.appendChild(btn);
    });
}

function finishQuiz() {
    showSubView("result-container");
    document.getElementById("score-text").innerHTML = `Kategorie: ${currentCategory}<br>Ergebnis: <b>${score} / ${quizData[currentCategory].length}</b>`;
    
    let data = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    if(!data.scores) data.scores = {};
    if(!data.scores[currentCategory] || score > data.scores[currentCategory]) {
        data.scores[currentCategory] = score;
    }
    data.played++;
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(data));
}

function showLeaderboard(category) {
    document.getElementById("leaderboard-title").innerText = `Ranking: ${category}`;
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    let ranks = [];

    for(let i=0; i<localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith("user_")) {
            let uData = JSON.parse(localStorage.getItem(key));
            let s = (uData.scores && uData.scores[category]) ? uData.scores[category] : 0;
            ranks.push({name: key.replace("user_",""), score: s});
        }
    }

    ranks.sort((a,b) => b.score - a.score).forEach((r, i) => {
        list.innerHTML += `<div class="item-row"><span>${i+1}. ${r.name}</span><b>${r.score} Pkt</b></div>`;
    });
    showSubView("leaderboard-view");
}

function updateAchievements() {
    const list = document.getElementById("achievements-list");
    const data = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    const totalScore = Object.values(data.scores || {}).reduce((a,b) => a+b, 0);
    
    list.innerHTML = `
        <div class="item-row ${data.played > 0 ? "" : "locked"}">🏁 Erster Versuch</div>
        <div class="item-row ${totalScore >= 5 ? "" : "locked"}">🔥 Punkte-Sammler</div>
        <div class="item-row ${Object.keys(data.scores || {}).length >= 3 ? "" : "locked"}">🌍 Allrounder</div>
    `;
}

function changeBrightness(v) { document.body.style.filter = `brightness(${v}%)`; }
function logout() { location.reload(); }
