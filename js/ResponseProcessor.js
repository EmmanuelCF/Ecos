class ResponseProcessor {
  constructor() {
    this.responses = [];
  }

  processResponse(response, question) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Procesado:", response);
        resolve();
      }, 1000);
    });
  }
}