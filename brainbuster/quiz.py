class Quiz:
    def __init__(self, questions):
        self.questions = questions
        self.score = 0

    def run(self):
        for question in self.questions:
            print("\n" + question.question)

            for i, option in enumerate(question.options):
                print(f"{i+1}. {option}")

            answer = input("Deine Antwort: ")

            if question.options[int(answer)-1] == question.answer:
                print("Richtig!")
                self.score += 1
            else:
                print("Falsch!")

        print(f"\nDein Score: {self.score}/{len(self.questions)}")
