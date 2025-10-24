class QuestionManager {
  constructor() {
    this.currentQuestion = "";
    this.questions = [
      "¿Qué es lo que más te importa en este momento?",
      "¿Qué te preocupa del futuro?",
      "¿Qué valoras más en tus relaciones?"
    ];
    this.questionIndex = 0;
  }

  setup() {
    this.currentQuestion = this.questions[this.questionIndex];
  }

  getCurrentQuestion() {
    return this.currentQuestion;
  }

  nextQuestion() {
    this.questionIndex = (this.questionIndex + 1) % this.questions.length;
    this.currentQuestion = this.questions[this.questionIndex];
    return this.currentQuestion;
  }

  getTotalQuestions() {
    return this.questions.length;
  }

  getCurrentIndex() {
    return this.questionIndex;
  }
}