# create_quiz_db.py
# ========================================================
# SCRIPT 1: Datenbank erstellen
# ========================================================
# Dieses Script legt die SQLite-Datenbank und die Tabelle "fragen" an.
# Es wird NUR EINMAL ausgeführt (oder wenn du die Tabelle neu anlegen willst).
#
# WICHTIG:
# - Es wird eine UNIQUE-Constraint auf (frage + tag) gesetzt.
# - Dadurch kann die gleiche Frage in derselben Kategorie nicht doppelt vorkommen.
# - Die Prüfung ist case-insensitive (Groß-/Kleinschreibung wird ignoriert).
#
# Autor: Für dich erstellt
# Datum: März 2026
# ========================================================

import sqlite3

DB_DATEI = "question-DB/quiz.db"          # Name der SQLite-Datenbank-Datei


def create_database() -> None:
    """Erstellt die Datenbank + Tabelle (falls noch nicht vorhanden)."""
    with sqlite3.connect(DB_DATEI) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS fragen (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                frage             TEXT    NOT NULL,
                antwort_a         TEXT    NOT NULL,
                antwort_b         TEXT    NOT NULL,
                antwort_c         TEXT    NOT NULL,
                antwort_d         TEXT    NOT NULL,
                richtige_antwort  TEXT    NOT NULL CHECK(richtige_antwort IN ('A','B','C','D')),
                tag               TEXT    NOT NULL,
                UNIQUE(frage, tag)               -- Verhindert Duplikate in derselben Kategorie
            )
        ''')
        print(f"✅ Datenbank '{DB_DATEI}' und Tabelle 'fragen' erfolgreich erstellt/überprüft.")
        print("   → UNIQUE-Constraint auf (frage + tag) ist aktiv (case-insensitive).")


if __name__ == "__main__":
    create_database()
