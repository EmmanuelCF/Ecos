class InputManager {
  constructor(font) { // ← AÑADE el parámetro font
    this.input = null;
    this.button = null;
    this.userResponse = "";
    this.confirmationMessage = "";
    this.font = font; // ← Ahora sí recibe la fuente
  }

  // ... el resto de tu código igual (está bien)
  setup() {
    this.createInputElements();
  }

  createInputElements() {
    // Crear input
    this.input = createInput();
    this.input.size(400, 40);
    this.applyInputStyles();

    // Crear botón
    this.button = createButton('Enviar');
    this.button.size(100, 40);
    this.applyButtonStyles();

    // Event listeners
    this.button.mousePressed(() => this.processResponse());
    this.input.input(() => this.updateResponse());
  }

  updatePosition(x, y, width) {
    if (this.input) {
      this.input.position(x, y);
      this.input.size(width, 40);
    }
    if (this.button) {
      this.button.position(x, y + 60);
    }
  }

  applyInputStyles() {
    this.input.style('background-color', '#e8f4f8');
    this.input.style('outline', 'none');
    this.input.style('border', 'none');
    this.input.style('border-radius', '0px');
    this.input.style('padding', '10px');
    this.input.style('font-size', '16px');
    this.input.style('color', '#333');
    if (this.font) {
      this.input.style('font-family', this.font);
    }
  }

  applyButtonStyles() {
    this.button.style('background-color', '#120000');
    this.button.style('color', 'white');
    this.button.style('border', 'none');
    this.button.style('border-radius', '1px');
    this.button.style('font-size', '14px');
    this.button.style('cursor', 'pointer');
  }

  updateResponse() {
    this.userResponse = this.input.value();
  }

  processResponse() {
    if (this.userResponse.trim() === "") {
      this.confirmationMessage = "Por favor, escribe algo...";
    } else {
      this.confirmationMessage = "✓ Respuesta recibida!";
      console.log("Respuesta:", this.userResponse);
    }
    return false;
  }

  clear() {
    this.userResponse = "";
    this.confirmationMessage = "";
    this.input.value('');
  }

  getResponse() {
    return this.userResponse;
  }

  getConfirmationMessage() {
    return this.confirmationMessage;
  }
}