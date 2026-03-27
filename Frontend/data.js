let quizData = {};

// Funktion zum Laden der Daten vom Flask-Server
async function loadQuizData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/questions');
        if (!response.ok) throw new Error("Server-Antwort war nicht ok");
        
        quizData = await response.json();
        console.log("Quiz-Daten erfolgreich geladen:", quizData);
        
        // Initialisiere die Menüs erst, wenn die Daten da sind!
        if (typeof initCategoryMenus === "function") {
            initCategoryMenus();
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Quiz-Daten:", error);
        alert("Konnte keine Fragen laden. Läuft der Flask-Server?");
    }
}

// Beim Start direkt laden
loadQuizData();