function showSection(id) {
    document.querySelectorAll(".glass-card").forEach(c => c.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    
    if(id === "login-form" || id === "register-form") {
        document.getElementById("nav-login").classList.toggle("active", id === "login-form");
        document.getElementById("nav-register").classList.toggle("active", id === "register-form");
    }
}

function showSubView(viewId) {
    document.querySelectorAll(".sub-view").forEach(v => v.classList.add("hidden"));
    document.getElementById(viewId).classList.remove("hidden");
    if(viewId === "category-selection" || viewId === "leaderboard-category-select") initCategoryMenus();
}

function initCategoryMenus() {
    const playContainer = document.getElementById("category-buttons");
    const leadContainer = document.getElementById("leaderboard-cat-buttons");
    playContainer.innerHTML = "";
    leadContainer.innerHTML = "";

    Object.keys(quizData).forEach(cat => {
        let btnPlay = document.createElement("button");
        btnPlay.className = "btn btn-secondary";
        btnPlay.innerText = cat;
        btnPlay.onclick = () => startQuiz(cat);
        playContainer.appendChild(btnPlay);

        let btnLead = document.createElement("button");
        btnLead.className = "btn btn-secondary";
        btnLead.innerText = cat;
        btnLead.onclick = () => showLeaderboard(cat);
        leadContainer.appendChild(btnLead);
    });
}

function changeBrightness(v) { document.body.style.filter = `brightness(${v}%)`; }