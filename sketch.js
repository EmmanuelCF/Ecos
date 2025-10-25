
let input;
let myQuestion = "¿QUÉ TE GUSTARÍA QUE ALGUIEN POR FIN ENTENDIERA?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let points = [];
let savedText = "";
let textAreaAndQuestionSize = 0;

let tamanoFuente = 60;

let dotSize = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);

  miTextarea = createElement('textarea');
  miTextarea.style('background-color', 'rgba(0,0,0,0)');
  miTextarea.style('caret-shape', 'block');
  miTextarea.style('caret-color', 'rgba(147,147,147,0)');
  miTextarea.style('outline', 'none');
  miTextarea.style('border', 'none');
  miTextarea.style('border-radius', '0px');
  miTextarea.style('padding', '10px');
  miTextarea.style('font-size', inputFontSize + 'px');
  miTextarea.style('color', 'rgba(0,0,0,0)'); // Transparente - bien!
  miTextarea.style('font-weight', 'bold');
  miTextarea.style('font-family', 'Montserrat Black, sans-serif');

  // IMPORTANTE: Usar input para detectar cada cambio de texto
  miTextarea.elt.addEventListener('input', function() {
    savedText = miTextarea.value(); // Actualizar el texto
    inputToText(); // Regenerar los puntos
  });

  miTextarea.elt.focus();
}

function preload() {
  customFont = loadFont('assets/fonts/Montserrat-Black.ttf');
}

function draw() {
  background('#000000');

  // TEXTO PRINCIPAL (pregunta)
  textFont(customFont);
  textAlign(CENTER, TOP);
  textSize(questionSize);
  fill('#8f8f8f');

  let lineasInfo = obtenerLineasTexto(myQuestion, width);
  lineasGeneradas = lineasInfo.length;
  text(myQuestion, 0, 0, width, height);

  // Posicionar textarea (transparente)
  miTextarea.position((width / 4) - (width / 4) / 4, questionSize * lineasGeneradas + questionSize - 20);
  miTextarea.size(width * 0.66, inputFontSize * .2);

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;

  // Dibujar PUNTOS con movimiento (esto es lo que se ve)
  /*for (let i = 0; i < points.length; i++) {
    let punto = points[i];
    let movX = sin(frameCount * 0.1 + i * 0.2) * 6;
    let movY = cos(frameCount * 0.08 + i * 0.15) * 6;

    fill(255, 255, 0);
    noStroke();
    ellipse(punto.x + movX, punto.y + movY, 5, 5);
  }*/

  for(let i = 0; i < points.length; i++){
    let x = points[i].x;
    let y = points[i].y;

    // Tamaño basado en la posición (no cambia entre frames)
    let dotSize = map((x + y) % 20, 0, 20, 2, 14);

    fill(255, 255, 0);
    noStroke();
    ellipse(x, y, dotSize);
  }
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
  inputToText();
}


function inputToText() {
  let anchoMaximo = width * 0.65;


  // Dividir el texto en líneas
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
  points = [];

  // Generar puntos para cada línea
  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);

    let puntosLinea = customFont.textToPoints(lineas[i], width/5, posY, tamanoFuente,
      {
        sampleFactor: 0.15,
        simplifyThreshold: 0
      }
    );

    points = points.concat(puntosLinea);
  }
}

// Función para dividir texto en líneas
function dividirEnLineas(texto, anchoMaximo, tamanoFuente) {
  textSize(tamanoFuente); // ¡Importante! Establecer el tamaño para textWidth()

  let palabras = texto.split(' ');
  let lineas = [];
  let lineaActual = '';

  for (let i = 0; i < palabras.length; i++) {
    let palabra = palabras[i];
    let pruebaLinea = lineaActual + (lineaActual ? ' ' : '') + palabra;

    if (textWidth(pruebaLinea) <= anchoMaximo) {
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