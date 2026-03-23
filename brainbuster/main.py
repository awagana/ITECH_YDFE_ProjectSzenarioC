from question import Question
from quiz import Quiz

# Beispiel-Fragen
q1 = Question(
    "Was ist 2+2?",
    ["3", "4", "5"],
    "4"
)

q2 = Question(
    "Hauptstadt von Frankreich?",
    ["Berlin", "Madrid", "Paris"],
    "Paris"
)

questions = [q1, q2]

quiz = Quiz(questions)
quiz.run()