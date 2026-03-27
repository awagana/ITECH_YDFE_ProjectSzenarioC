let currentQuestionIndex = 0;
let score = 0;
let currentCategory = "";

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