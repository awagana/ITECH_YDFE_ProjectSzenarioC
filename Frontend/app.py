from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# WICHTIG: Pfad passend zu deinem Screenshot
# Da app.py im Hauptordner liegt, muss sie in 'question-DB' schauen
DB_PATH = os.path.join("question-DB", "quiz.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/api/questions')
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
if __name__ == '__main__':
    app.run(debug=True, port=5000)
