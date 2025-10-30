let miTextarea;
let myQuestion = "¿QUÉ TE GUSTARÍA QUE ALGUIEN POR FIN ENTENDIERA?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let points = [];
let savedText = "";
let textAreaAndQuestionSize = 0;
let tamanoFuente = 60;
let dotSize = 4;

let generando = false;

// Variables para el debounce híbrido
let timeoutInput;
let lastProcessedText = "";

let distorsionador;
let textosGenerados = [];

let finalTexto = "";

let baseSizes = [];
let limite = 0.8;

let minRadio = 7;
let maxRadio = 12;

let botonEnviar;

let fadingLetters = [];

let canDrawPoins = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  distorsionadorTexto.inicializar().then(exito => {
    if (exito) {
      console.log("✅ Modelo de IA cargado y listo");
    } else {
      console.error("❌ No se pudo cargar el modelo");
    }
  });

  miTextarea = createElement('textarea');
  miTextarea.style('background-color', 'rgba(0,0,0,0)');
  miTextarea.style('caret-shape', 'block');
  miTextarea.style('caret-color', '#575757'); // Color del cursor
  miTextarea.style('outline', 'none');
  miTextarea.style('border', 'none');
  miTextarea.style('border-radius', '0px');
  miTextarea.style('padding', '10px');
  miTextarea.style('font-size', inputFontSize + 'px');
  miTextarea.style('color', 'rgba(255,255,255,255)');
  miTextarea.style('font-weight', 'bold');
  miTextarea.style('font-family', 'Montserrat Black, sans-serif');
  miTextarea.attribute('autofocus', '');

  // DEBOUNCE HÍBRIDO - Opción 1
  miTextarea.elt.addEventListener('input', function() {
    savedText = miTextarea.value();

    // Regeneración INMEDIATA pero simplificada (solo outline)
    inputToTextFast();

    // Debounce para regeneración COMPLETA (con puntos interiores)
    clearTimeout(timeoutInput);
    timeoutInput = setTimeout(function() {
      if (savedText !== lastProcessedText) {
        inputToTextComplete();
        lastProcessedText = savedText;
        console.log("Regeneración COMPLETA con puntos interiores");
      }
    }, 500);
  });


  botonEnviar = createButton('Enviar');
  botonEnviar.size(110, 60);
  botonEnviar.style('font-weight', 'bold');
  botonEnviar.style('font-family', 'Montserrat Black, sans-serif');
  botonEnviar.style('background-color', '#3e3e3e');
  botonEnviar.style('color', 'white');
  botonEnviar.style('border', 'none');
  botonEnviar.style('border-radius', '16px');
  botonEnviar.style('font-size', '16px');
  botonEnviar.style('cursor', 'pointer');
  botonEnviar.style('transition', 'all 0.3s');

  // Efecto hover con CSS
  botonEnviar.elt.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#8c8c8c';
    this.style.transform = 'scale(1.05)';
  });

  botonEnviar.elt.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#707070';
    this.style.transform = 'scale(1)';
  });

  miTextarea.elt.focus();
  botonEnviar.mousePressed(cambioTextoPuntos);
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
  miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');
  miTextarea.elt.focus();

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;

  botonEnviar.position(width / 2 - botonEnviar.width / 2, textAreaAndQuestionSize + miTextarea.elt.scrollHeight);

  // DIBUJAR LETRAS QUE SE DESVANECEN - CON LA MISMA CONFIGURACIÓN
  textFont(customFont);
  textAlign(LEFT, BASELINE);

  for (let i = fadingLetters.length - 1; i >= 0; i--) {
    let letter = fadingLetters[i];

    // Reducir opacidad
    letter.alpha -= letter.fadeSpeed;

    // Mover ligeramente hacia arriba
    letter.y -= letter.floatSpeed;

    // Mostrar letra si aún es visible
    if (letter.alpha > 0) {
      push();
      fill(letter.color.levels[0], letter.color.levels[1], letter.color.levels[2], letter.alpha);
      textSize(letter.size);
      textFont(customFont);
      text(letter.char, letter.x, letter.y);
      pop();
    } else {
      // Eliminar letra cuando se desvanece completamente
      fadingLetters.splice(i, 1);
    }
  }

  // Dibujar puntos
  /*for (let i = 0; i < points.length; i++) {
    let x = points[i].x;
    let y = points[i].y;

    let tamanoBase = baseSizes[i];
    let puntoLimite = points.length * limite;

    if(i < puntoLimite) {
      // Puntos dentro del límite - alta intensidad
      let intensidad = map(i, 0, puntoLimite, 4, 1); // Intensidad decreciente
      let variacion = sin(frameCount * 0.05 + i * 0.1) * intensidad;
      let dotSize = tamanoBase + variacion;

      fill(255, 255, 0);
      noStroke();
      ellipse(x, y, dotSize);
    } else {
      // Puntos fuera del límite - baja intensidad
      let intensidad = 0.5; // Intensidad muy baja
      let variacion = sin(frameCount * 0.02 + i * 0.1) * intensidad;
      let dotSize = tamanoBase + variacion; // Más pequeños

      fill(255, 255, 0, 255); // Un poco transparentes
      noStroke();
      ellipse(x, y, dotSize);
    }
  }*/
}

function inputToTextFast() {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
  points = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    // SOLO outline, más rápido (menos densidad)
    let puntosOutline = customFont.textToPoints(lineas[i], posX, posY, tamanoFuente, {
      sampleFactor: 0.15, // Menos densidad para mayor velocidad
      simplifyThreshold: 0
    });

    points = points.concat(puntosOutline);
  }
}

function inputToTextComplete() {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
  points = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    // Outline completo
    let puntosOutline = customFont.textToPoints(lineas[i], posX, posY, tamanoFuente, {
      sampleFactor: 0.15,
      simplifyThreshold: 0
    });

    points = points.concat(puntosOutline);
  }


  for (let i = 0; i < points.length; i++) {
    baseSizes.push(random(minRadio, maxRadio)); // Tamaños base entre 5 y 15
  }
  console.log("Regeneración COMPLETA:", points.length, "puntos");
}

// El resto de tus funciones se mantienen igual...
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
  inputToTextComplete(); // Usar la versión completa al redimensionar
}


function dividirEnLineas(texto, anchoMaximo, tamanoFuente) {
  textSize(tamanoFuente);
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


async function generarDistorsion(tipo) {
  if (generando) return;

  generando = true;
  let textoOriginal = miTextarea.value();

  let resultado = await distorsionadorTexto.distorsionarTexto(textoOriginal, tipo);

  finalTexto = resultado + savedText;
  miTextarea.value(finalTexto);
  generando = false;
}


function cambioTextoPuntos() {
  createFadingLetters(miTextarea.value());
}

function createFadingLetters(text) {
  // USAR LAS MISMAS COORDENADAS QUE TU SISTEMA DE PUNTOS EXISTENTE
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(text, anchoMaximo, tamanoFuente);

  // Limpiar array existente
  fadingLetters = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY =  textAreaAndQuestionSize + tamanoFuente ;
    let posX = width/5;

    // Crear letras en la MISMA posición donde se generan los puntos
    for (let j = 0; j < lineas[i].length; j++) {
      let char = lineas[i].charAt(j);
      if (char !== ' ') {
        // Calcular posición X individual de cada carácter
        textSize(tamanoFuente);
        textFont(customFont);
        let charWidth = textWidth(char);
        let charX = posX + textWidth(lineas[i].substring(0, j));

        fadingLetters.push({
          char: char,
          x: charX,
          y: posY,
          alpha: 255,
          fadeSpeed: random(2, 5),
          floatSpeed: random(0.2, 0.5),
          size: tamanoFuente,
          color: color(255, 255, 255),
          font: customFont
        });
      }
    }
  }

  canDrawPoins = true;
  miTextarea.style('color', 'rgba(255,255,255,0)');
  //miTextarea.value('');
}