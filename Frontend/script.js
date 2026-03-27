let currentUser = '';
let currentQuestionIndex = 0;
let score = 0;

const questions = [
    { q: 'Was ist die Hauptstadt von Deutschland?', a: [{t: 'Berlin', c: true}, {t: 'München', c: false}] },
    { q: 'Was ergibt 10 * 10?', a: [{t: '100', c: true}, {t: '1000', c: false}] },
    { q: 'Ist JavaScript das Gleiche wie Java?', a: [{t: 'Nein', c: true}, {t: 'Ja', c: false}] }
];

// --- NAVIGATION MIT ACTIVE-STATE ---
function showSection(id) {
    // 1. Alle Form-Boxen verstecken
    document.querySelectorAll('.glass-card').forEach(c => c.classList.add('hidden'));
    
    // 2. Die gewählte Box anzeigen
    document.getElementById(id).classList.remove('hidden');

    // 3. Nav-Button Active State umschalten
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');

    if (id === 'login-form') {
        navLogin.classList.add('active');
        navRegister.classList.remove('active');
    } else if (id === 'register-form') {
        navRegister.classList.add('active');
        navLogin.classList.remove('active');
    }
}

function showSubView(viewId) {
    document.querySelectorAll('.sub-view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// --- LOGIK ---
function handleRegister() {
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value;
    if(user && pass) {
        if(localStorage.getItem(`user_${user}`)) return alert('Name existiert bereits!');
        localStorage.setItem(`user_${user}`, JSON.stringify({pass, highscore: 0, played: 0}));
        alert('Account erstellt!');
        showSection('login-form');
    }
}

function handleLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const raw = localStorage.getItem(`user_${user}`);
    if(raw) {
        const data = JSON.parse(raw);
        if(data.pass === pass) {
            currentUser = user;
            // Nav komplett ausblenden, wenn eingeloggt
            document.getElementById('nav-menu').style.display = 'none';
            document.getElementById('welcome-text').innerHTML = `Bereit, <span style='color:#00f2ff'>${user}</span>?`;
            showSection('quiz-area');
            showSubView('quiz-intro');
        } else alert('Passwort falsch!');
    } else alert('User nicht gefunden!');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showSubView('question-container');
    showQuestion();
}

function showQuestion() {
    const btnContainer = document.getElementById('answer-buttons');
    btnContainer.innerHTML = '';
    const q = questions[currentQuestionIndex];
    document.getElementById('question').innerText = q.q;

    q.a.forEach(ans => {
        const btn = document.createElement('button');
        btn.innerText = ans.t;
        btn.className = 'btn btn-secondary';
        btn.onclick = () => {
            if(ans.c) score++;
            currentQuestionIndex++;
            if(currentQuestionIndex < questions.length) showQuestion();
            else finishQuiz();
        };
        btnContainer.appendChild(btn);
    });
}

function finishQuiz() {
    showSubView('result-container');
    document.getElementById('score-text').innerHTML = `Score: <b>${score} / ${questions.length}</b>`;
    let data = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    data.played++;
    if(score > data.highscore) data.highscore = score;
    localStorage.setItem(`user_${currentUser}`, JSON.stringify(data));
}

function updateLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    let users = [];
    for(let i=0; i<localStorage.length; i++){
        let key = localStorage.key(i);
        if(key.startsWith('user_')) users.push({n: key.replace('user_',''), s: JSON.parse(localStorage.getItem(key)).highscore});
    }
    users.sort((a,b)=>b.s-a.s).forEach((u,i) => {
        list.innerHTML += `<div class='item-row'><span>${i+1}. ${u.n}</span> <b>${u.s} Pkt</b></div>`;
    });
}

function updateAchievements() {
    const list = document.getElementById('achievements-list');
    const data = JSON.parse(localStorage.getItem(`user_${currentUser}`));
    list.innerHTML = `
        <div class='item-row ${data.played > 0 ? '' : 'locked'}'>🏁 Einsteiger</div>
        <div class='item-row ${data.highscore === questions.length ? '' : 'locked'}'>💎 Meister</div>
        <div class='item-row ${data.played >= 5 ? '' : 'locked'}'>🔥 Veteran</div>
    `;
}

function changeBrightness(v) { document.body.style.filter = `brightness(${v}%)`; }
function logout() { location.reload(); }
