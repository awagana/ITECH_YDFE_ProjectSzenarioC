import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "question-DB")
DB_DATEI = os.path.join(DB_DIR, "quiz.db")


def setup():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
        print(f"📁 Ordner erstellt: {DB_DIR}")

    with sqlite3.connect(DB_DATEI) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS fragen (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                frage TEXT NOT NULL,
                antwort_a TEXT NOT NULL,
                antwort_b TEXT NOT NULL,
                antwort_c TEXT NOT NULL,
                antwort_d TEXT NOT NULL,
                richtige_antwort TEXT NOT NULL,
                tag TEXT NOT NULL,
                UNIQUE(frage, tag)
            )
        ''')
        conn.execute('''
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        category TEXT NOT NULL,
        score INTEGER NOT NULL,
        UNIQUE(username, category) ON CONFLICT REPLACE
    )
''')

        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        ''')
        print(f"✅ Datenbank synchronisiert: {DB_DATEI}")


if __name__ == "__main__":
    setup()
