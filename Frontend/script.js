const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const quizArea = document.getElementById("quiz-area");
const navMenu = document.getElementById("nav-menu");
const welcomeText = document.getElementById("welcome-text");

// Quiz Elemente
const questionContainer = document.getElementById("question-container");
const quizIntro = document.getElementById("quiz-intro");
const resultContainer = document.getElementById("result-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");



// --- NAVIGATION ---
function showLogin() {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    quizArea.classList.add("hidden");
}

function showRegister() {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    quizArea.classList.add("hidden");
}

// --- USER LOGIK (Login via Name) ---
function handleRegister() {
    const user = document.getElementById("reg-user").value.trim();
    const pass = document.getElementById("reg-pass").value;

    if(user && pass) {
        if(localStorage.getItem(user)) {
            alert("Dieser Name ist bereits vergeben!");
        } else {
            localStorage.setItem(user, pass); // Name ist Key, Passwort ist Value
            alert("Konto für " + user + " wurde erstellt!");
            showLogin();
        }
    } else { alert("Bitte Name und Passwort eingeben!"); }
}

function handleLogin() {
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const storedPass = localStorage.getItem(user);

    if(storedPass) {
        if(storedPass === pass) {
            loginForm.classList.add("hidden");
            navMenu.classList.add("hidden"); 
            quizArea.classList.remove("hidden");
            welcomeText.innerText = `Hallo, ${user}! 👋`;
        } else { alert("Passwort falsch!"); }
    } else { alert("Benutzername nicht gefunden!"); }
}

function logout() { location.reload(); }

// --- QUIZ LOGIK (Beispiel-Fragen) ---
const questions = [
    { q: "Was ist die Hauptstadt von Deutschland?", a: [{t: "Berlin", c: true}, {t: "München", c: false}] },
    { q: "Was ergibt 10 * 10?", a: [{t: "100", c: true}, {t: "1000", c: false}] },
    { q: "Ist JavaScript das Gleiche wie Java?", a: [{t: "Ja", c: false}, {t: "Nein", c: true}] }
];

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    quizIntro.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    let q = questions[currentQuestionIndex];
    questionElement.innerText = q.q;
    q.a.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.t;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(answer.c));
        answerButtons.appendChild(button);
    });
}

function resetState() {
    while (answerButtons.firstChild) { answerButtons.removeChild(answerButtons.firstChild); }
}

function selectAnswer(correct) {
    if(correct) score++;
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    document.getElementById("score-text").innerText = `Ergebnis: ${score} von ${questions.length} Punkten!`;
}

function restartQuiz() { startQuiz(); }