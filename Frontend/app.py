from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "question-DB", "quiz.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


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


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"error": "Daten unvollständig"}), 400
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "User erstellt"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username vergeben"}), 400


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user_db = get_db_connection().execute(
        "SELECT * FROM users WHERE username = ?", (data.get('username'),)
    ).fetchone()
    if user_db and check_password_hash(user_db['password'], data.get('password')):
        return jsonify({"message": "Erfolg", "user": {"id": user_db['id'], "username": user_db['username']}}), 200
    return jsonify({"error": "Login fehlgeschlagen"}), 401


# --- NEUE SCORE ROUTEN ---

@app.route('/api/save_score', methods=['POST'])
def save_score():
    data = request.json
    username, category, score = data.get('username'), data.get('category'), data.get('score')
    try:
        conn = get_db_connection()
        # Nur speichern, wenn neuer Score höher ist oder noch nicht existiert
        existing = conn.execute(
            "SELECT score FROM scores WHERE username = ? AND category = ?", (username, category)
        ).fetchone()
        if existing is None or score > existing['score']:
            conn.execute("INSERT INTO scores (username, category, score) VALUES (?, ?, ?) "
                         "ON CONFLICT(username, category) DO UPDATE SET score = excluded.score", (username, category, score))
            conn.commit()
        conn.close()
        return jsonify({"status": "saved"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/leaderboard/<category>', methods=['GET'])
def get_leaderboard(category):
    try:
        conn = get_db_connection()
        rows = conn.execute(
            "SELECT username, score FROM scores WHERE category = ? ORDER BY score DESC LIMIT 10", (category,)
        ).fetchall()
        conn.close()
        return jsonify([{"name": r['username'], "score": r['score']} for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)