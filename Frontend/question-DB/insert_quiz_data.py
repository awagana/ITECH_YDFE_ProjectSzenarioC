# insert_quiz_data.py
# ========================================================
# SCRIPT 2: Daten aus JSON in die Datenbank einfügen
# ========================================================
# Dieses Script liest deine quiz_fragen.json und fügt alle Fragen in die Datenbank ein.
#
# Besondere Features:
# - Vor jedem Einfügen wird geprüft, ob die Frage in dieser Kategorie bereits existiert.
# - Die Prüfung ist CASE-INSENSITIVE → "Was ist die Hauptstadt..." und "was ist die hauptstadt..." werden als gleich erkannt.
# - Gleiche Frage in unterschiedlichen Kategorien ist erlaubt.
# - Übersprungene Fragen werden klar angezeigt.
# - Vollständige Fehlerbehandlung + schöne Abschluss-Statistik.
#
# Voraussetzung: Die Datenbank muss vorher mit create_quiz_db.py angelegt worden sein.
#
# Autor: Für dich erstellt
# Datum: März 2026
# ========================================================

import json
import sqlite3
from typing import Any

JSON_DATEI = "question-DB/quiz_fragen.json"   # Pfad zu deiner JSON-Datei
DB_DATEI = "question-DB/quiz.db"              # Muss mit create_quiz_db.py übereinstimmen


def load_json() -> list[dict[str, Any]]:
    """Lädt die JSON-Datei und gibt die Liste der Fragen zurück.
    Funktioniert sowohl mit {"quiz_fragen": [...]} als auch mit direktem Array.
    """
    with open(JSON_DATEI, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("quiz_fragen", data)


def insert_data() -> None:
    """Hauptfunktion: Liest JSON und fügt Fragen ein (mit Duplikat-Prüfung)."""
    fragen = load_json()
    neu_eingefuegt = 0
    uebersprungen = 0

    with sqlite3.connect(DB_DATEI) as conn:
        cursor = conn.cursor()

        for frage in fragen:
            # === CASE-INSENSITIVE DUPLIKAT-PRÜFUNG ===
            cursor.execute(
                "SELECT COUNT(*) FROM fragen WHERE LOWER(frage) = LOWER(?) AND LOWER(tag) = LOWER(?)",
                (frage["frage"], frage["tag"])
            )
            exists = cursor.fetchone()[0] > 0

            if exists:
                uebersprungen += 1
                print(f"⏭️  Übersprungen (bereits vorhanden – case-insensitive): "
                      f"{frage['tag']} → {frage['frage'][:60]}...")
                continue

            # === Neue Frage einfügen ===
            cursor.execute('''
                INSERT INTO fragen
                (frage, antwort_a, antwort_b, antwort_c, antwort_d, richtige_antwort, tag)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                frage["frage"],
                frage["antworten"]["A"],
                frage["antworten"]["B"],
                frage["antworten"]["C"],
                frage["antworten"]["D"],
                frage["richtige_antwort"],
                frage["tag"]
            ))
            neu_eingefuegt += 1

    # === Abschluss-Statistik ===
    print("\n" + "=" * 60)
    print("✅ IMPORT ERFOLGREICH ABGESCHLOSSEN!")
    print(f"   Neu eingefügt : {neu_eingefuegt} Fragen")
    print(f"   Übersprungen  : {uebersprungen} Fragen")
    print(f"   Gesamt in DB  : {neu_eingefuegt + uebersprungen} Fragen")
    print("=" * 60)


if __name__ == "__main__":
    try:
        insert_data()
    except FileNotFoundError:
        print(f"❌ JSON-Datei '{JSON_DATEI}' nicht gefunden!")
    except json.JSONDecodeError:
        print(f"❌ '{JSON_DATEI}' ist keine gültige JSON-Datei!")
    except KeyError as e:
        print(f"❌ Fehlender Schlüssel in der JSON: {e}")
    except sqlite3.Error as e:
        print(f"❌ Datenbank-Fehler: {e}")
    except Exception as e:
        print(f"❌ Unerwarteter Fehler: {e}")
