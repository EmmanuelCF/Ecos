
let input;

let myQuestion = "¿QUÉ ES LO QUE MÁS TE PREOCUPA?";
let questionSize = 100;//esta es la altura
let widthQuestion = 0;

let lineasGeneradas = 0;
let lineasGeneradasInput = 0;

let inputFontSize = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);

  miTextarea  = createElement('textarea');
  miTextarea.style('background-color', '#353535');
  miTextarea.style('caret-shape', 'block');
  miTextarea.style('caret-color', '#e6e6e6'); // Color del cursor
  miTextarea.style('outline', 'none');
  miTextarea.style('border', 'none');
  miTextarea.style('border-radius', '0px');
  miTextarea.style('padding', '10px');
  miTextarea.style('font-size', '70px');
  miTextarea.style('color', '#ffffff');
  miTextarea.style('font-family', 'CalSans-Regular');

  // Capturar la tecla Enter
  miTextarea.elt.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita el salto de línea
      hacerAlgoConEnter();
    }
  });

}

function preload() {
  // Carga tu fuente personalizada (debes tener el archivo en tu proyecto)
  customFont = loadFont('assets/fonts/CalSans-Regular.ttf');

}

function draw() {
  background('#f0f0f0');

  // TEXTO PRINCIPAL
  textFont(customFont)
  textAlign(CENTER, TOP);
  textSize(questionSize);
  fill('#353535');

  let lineasInfo = obtenerLineasTexto(myQuestion, width);
  lineasGeneradas = lineasInfo.length;

  text(myQuestion, 0, 0, width, height );

  miTextarea.position((width / 4) - (width/4)/4, questionSize * lineasGeneradas + questionSize - 20);
  miTextarea.size(width * 0.66, inputFontSize * .2);
  miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');
  miTextarea.elt.focus();

  //text(widthQuestion, width / 2, questionSize * lineasGeneradas + 40);
}

function obtenerLineasTexto(texto, anchoMaximo) {
  textSize(questionSize);
  let palabras = texto.split(' ');
  let lineas = [];
  let lineaActual = '';

  for (let i = 0; i < palabras.length; i++) {
    let palabra = palabras[i];
    let pruebaLinea = lineaActual + (lineaActual ? ' ' : '') + palabra;
    let anchoLinea = textWidth(pruebaLinea);

    if (anchoLinea <= anchoMaximo) {
      lineaActual = pruebaLinea;
    } else {
      if (lineaActual) {
        lineas.push(lineaActual);
      }
      lineaActual = palabra;
    }
  }

  if (lineaActual) {
    lineas.push(lineaActual);
  }

  return lineas;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function hacerAlgoConEnter() {
  miTextarea.style('background-color', '#cc0000');
  // Aquí pones lo que quieres que haga el Enter
}
