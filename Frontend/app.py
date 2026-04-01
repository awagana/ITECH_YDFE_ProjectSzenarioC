from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Erlaubt deinem Frontend den Zugriff auf das Backend

# Pfad zur Datenbank (muss zum Ordner passen)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "question-DB", "quiz.db")


def get_db_connection():
    """Stellt eine Verbindung zur SQLite-Datenbank her."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================================
# ROUTE: QUIZ-FRAGEN LADEN
# ==========================================
@app.route('/api/questions', methods=['GET'])
def get_questions():
    try:
        conn = get_db_connection()
        rows = conn.execute("SELECT * FROM fragen").fetchall()
        conn.close()

        quiz_data = {}
        for row in rows:
            tag = row['tag']
            if tag not in quiz_data:
                quiz_data[tag] = []

            quiz_data[tag].append({
                "q": row['frage'],
                "a": [
                    {"t": row['antwort_a'], "c": row['richtige_antwort'] == 'A'},
                    {"t": row['antwort_b'], "c": row['richtige_antwort'] == 'B'},
                    {"t": row['antwort_c'], "c": row['richtige_antwort'] == 'C'},
                    {"t": row['antwort_d'], "c": row['richtige_antwort'] == 'D'}
                ]
            })
        return jsonify(quiz_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# ROUTE: REGISTRIERUNG
# ==========================================
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Benutzername und Passwort erforderlich!"}), 400

    # Passwort hashen (niemals im Klartext speichern!)
    # 'pbkdf2:sha256' funktioniert auf jedem System, auch wenn scrypt fehlt
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, hashed_password)
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "User erfolgreich erstellt!"}), 201
    except sqlite3.IntegrityError:
        # Dieser Fehler tritt auf, wenn der Username (UNIQUE) schon existiert
        return jsonify({"error": "Benutzername ist bereits vergeben!"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# ROUTE: LOGIN
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Bitte alle Felder ausfüllen!"}), 400

    try:
        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE username = ?",
            (username,)
        ).fetchone()
        conn.close()

        # Prüfen, ob User existiert UND das Passwort (gehasht) stimmt
        if user and check_password_hash(user['password'], password):
            return jsonify({
                "message": "Login erfolgreich",
                "user": {
                    "id": user['id'],
                    "username": user['username']
                }
            }), 200
        else:
            return jsonify({"error": "Ungültiger Benutzername oder Passwort!"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# SERVER STARTEN
# ==========================================
if __name__ == '__main__':
    # Debug-Modus über Umgebungsvariable oder Standardmäßig False
    is_debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(debug=is_debug, port=5001)
