let currentQuestionIndex = 0;
let score = 0;
let currentCategory = "";
let timeLeft = 10;
let timerInterval = null;

/**
 * Startet ein neues Quiz für die gewählte Kategorie
 */
function startQuiz(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 10; // Reset auf 10 Sekunden

    showSubView("question-container");
    startTimer();
    showQuestion();
}

/**
 * Der Countdown-Timer
 */
function startTimer() {
    const timerElement = document.getElementById("timer-display");
    if(timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Zeit: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishQuiz("⏳ Zeit abgelaufen!");
        }
    }, 1000);
}

/**
 * Zeigt die aktuelle Frage an
 */
function showQuestion() {
    const btnContainer = document.getElementById("answer-buttons");
    btnContainer.innerHTML = "";
    
    const questions = quizData[currentCategory];
    
    // Falls keine Fragen mehr da sind oder Kategorie ungültig
    if (!questions || currentQuestionIndex >= questions.length) {
        clearInterval(timerInterval);
        finishQuiz("🏁 Quiz beendet!");
        return;
    }

    const q = questions[currentQuestionIndex];
    document.getElementById("question").innerText = q.q;

    // Antwort-Buttons erstellen
    q.a.forEach(ans => {
        const btn = document.createElement("button");
        btn.innerText = ans.t;
        btn.className = "btn btn-secondary";
        btn.onclick = () => {
            if(ans.c) score++;
            currentQuestionIndex++;
            showQuestion();
        };
        btnContainer.appendChild(btn);
    });
}

/**
 * Beendet das Quiz, stoppt den Timer und speichert den Score
 */
async function finishQuiz(statusLabel = "Ergebnis") {
    if(timerInterval) clearInterval(timerInterval);
    
    showSubView("result-container");
    
    // Ergebnis-Anzeige auf der Karte fixieren
    document.getElementById("score-text").innerHTML = `
        <div style="border: 2px solid #00f2ff; padding: 20px; border-radius: 15px; background: rgba(0,0,0,0.3); margin-top: 15px;">
            <h3 style="color: #ff4757; margin-bottom: 10px;">${statusLabel}</h3>
            <p>Du hast erreicht:</p>
            <h1 style="font-size: 3rem; color: #00f2ff; margin: 10px 0;">${score}</h1>
            <p style="opacity: 0.8;">Kategorie: ${currentCategory}</p>
        </div>
    `;

    // Score an Flask-Server senden
    try {
        await fetch(`${API_URL}/save_score`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: currentUser,
                category: currentCategory,
                score: score
            })
        });
        console.log("Score erfolgreich in der Datenbank gespeichert.");
    } catch (e) {
        console.error("Netzwerkfehler beim Speichern des Scores:", e);
    }
}

/**
 * Lädt das globale Leaderboard vom Server
 */
async function showLeaderboard(category) {
    document.getElementById("leaderboard-title").innerText = `Ranking: ${category}`;
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "Lade Ranking...";
    showSubView("leaderboard-view");

    try {
        const response = await fetch(`${API_URL}/leaderboard/${category}`);
        const ranks = await response.json();
        
        list.innerHTML = "";
        if (ranks.length === 0) {
            list.innerHTML = "<p>Noch keine Einträge vorhanden.</p>";
            return;
        }

        ranks.forEach((r, i) => {
            list.innerHTML += `
                <div class="item-row">
                    <span>${i+1}. ${r.name}</span>
                    <b>${r.score} Pkt</b>
                </div>`;
        });
    } catch (e) {
        list.innerHTML = "Fehler beim Laden des Rankings.";
        console.error(e);
    }
}

/**
 * Platzhalter für Erfolge (Achievements)
 */
function updateAchievements() {
    const list = document.getElementById("achievements-list");
    list.innerHTML = `
        <div class="item-row">🏁 Spiel gestartet</div>
        <p style="font-size: 0.8rem; margin-top: 10px;">Erfolge werden bald mit der Datenbank synchronisiert!</p>
    `;
}