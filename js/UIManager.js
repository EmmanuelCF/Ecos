class UIManager {
  constructor(font) {
    this.font = font;
  }

  getMargin() {
    return 50;
  }

  getInputWidth() {
    return width - 100;
  }

  getInputY() {
    return 150;
  }

  updatePositions(inputManager) {
    let margin = this.getMargin();
    let inputY = this.getInputY();
    let inputWidth = this.getInputWidth();
    inputManager.updatePosition(margin, inputY, inputWidth);
  }

  drawBackground() {
    background(255);
  }

  drawQuestion(question) {
    let margin = this.getMargin();
    let textWidth = this.getInputWidth(); // ← Usar el ancho disponible

    fill(0);
    textSize(32);
    textAlign(LEFT, TOP);
    if (this.font) {
      textFont(this.font);
    }

    // ↓ ESTA ES LA CLAVE: el cuarto parámetro es el ancho máximo ↓
    text(question, margin, margin, textWidth, 100);

    // Para debug - muestra el área de texto
    noFill();
    stroke(255, 0, 0);
    rect(margin, margin, textWidth, 100);
  }

  drawConfirmation(message) {
    if (message !== "") {
      let margin = this.getMargin();
      let inputY = this.getInputY();

      fill(0, 150, 0);
      textSize(16);
      text(message, margin, inputY + 80);
    }
  }

  drawUserResponse(response) {
    if (response !== "") {
      let margin = this.getMargin();
      let inputY = this.getInputY();

      fill(0, 0, 150);
      textSize(18);
      text("Tu respuesta: " + response, margin, inputY + 120);
    }
  }
}