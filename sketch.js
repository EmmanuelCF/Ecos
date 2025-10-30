let miTextarea;
let myQuestion = "¿QUÉ TE GUSTARÍA QUE ALGUIEN POR FIN ENTENDIERA?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let points = [];
let savedText = "";
let textAreaAndQuestionSize = 0;
let tamanoFuente = 40;
let dotSize = 4;

let generando = false;

// Variables para el debounce híbrido
let timeoutInput;
let lastProcessedText = "";

let textosGenerados = [];

let finalTexto = "";

let limite = 0.8;

let botonEnviar;

let fadingLetters = [];

// NUEVAS VARIABLES: Controlar estados
let mostrarPuntos = false;
let puntosAlpha = 0;
let estadoActual = "escribiendo";

// VARIABLES PARA EFECTO DE RUIDO Y MENSAJES EXTRA
let ruidoIntensidad = 15;
let puntosBase = [];
let mouseCerca = false;
let mensajesExtra = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Inicializar el modelo de IA
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
  miTextarea.style('caret-color', '#575757');
  miTextarea.style('outline', 'none');
  miTextarea.style('border', 'none');
  miTextarea.style('border-radius', '0px');
  miTextarea.style('padding', '10px');
  miTextarea.style('font-size', tamanoFuente + 'px');
  miTextarea.style('color', 'rgba(255,255,255,255)');
  miTextarea.style('font-weight', 'bold');
  miTextarea.style('font-family', 'Montserrat Black, sans-serif');
  miTextarea.attribute('autofocus', '');

  // DEBOUNCE HÍBRIDO
  miTextarea.elt.addEventListener('input', function() {
    savedText = miTextarea.value();
    inputToTextFast();
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

  botonEnviar.elt.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#8c8c8c';
    this.style.transform = 'scale(1.05)';
  });

  botonEnviar.elt.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#707070';
    this.style.transform = 'scale(1)';
  });

  miTextarea.elt.focus();
  botonEnviar.mousePressed(iniciarProcesoCompleto);
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

  // Posicionar textarea
  miTextarea.position((width / 4) - (width / 4) / 4, questionSize * lineasGeneradas + questionSize - 20);
  miTextarea.size(width * 0.66, inputFontSize * .2);
  miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');

  if (estadoActual === "escribiendo") {
    miTextarea.elt.focus();
  }

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;
  botonEnviar.position(width / 2 - botonEnviar.width / 2, textAreaAndQuestionSize + miTextarea.elt.scrollHeight);

  // Mostrar letras que se desvanecen
  textFont(customFont);
  for (let i = fadingLetters.length - 1; i >= 0; i--) {
    let letter = fadingLetters[i];
    letter.alpha -= letter.fadeSpeed;
    letter.y -= letter.floatSpeed;

    if (letter.alpha > 0) {
      push();
      fill(letter.color.levels[0], letter.color.levels[1], letter.color.levels[2], letter.alpha);
      textSize(letter.size);
      text(letter.char, letter.x, letter.y);
      pop();
    } else {
      fadingLetters.splice(i, 1);
    }
  }

  // Detectar si el mouse está cerca del texto
  let mouseXDentro = mouseX > width/5 - 50 && mouseX < width/5 + width * 0.65 + 50;
  let mouseYDentro = mouseY > textAreaAndQuestionSize - 50 && mouseY < textAreaAndQuestionSize + (points.length > 0 ? points[points.length-1].y + 50 : height);
  mouseCerca = mouseXDentro && mouseYDentro;

  // Calcular intensidad del ruido basado en la proximidad del mouse
  let intensidadActual = mouseCerca ?
    map(dist(mouseX, mouseY, width/2, textAreaAndQuestionSize + 100), 0, 200, 2, ruidoIntensidad) :
    ruidoIntensidad;

  // Mostrar puntos con efecto de ruido
  if (mostrarPuntos && points.length > 0 && puntosBase.length === points.length) {
    if (puntosAlpha < 255) {
      puntosAlpha += 3;
    }

    for (let i = 0; i < points.length; i++) {
      let base = puntosBase[i];

      let distanciaMouse = dist(mouseX, mouseY, base.x, base.y);
      let radioInfluencia = 200;

      let factorRuido = 1.0;

      if (distanciaMouse < radioInfluencia) {
        // Usar curva exponencial para que se calme más rápido cerca del mouse
        let t = map(distanciaMouse, 0, radioInfluencia, 0, 1);
        factorRuido = pow(t, 2); // Cuadrático - más drástico cerca del mouse
      }

      let ruidoX = sin(frameCount * 0.05 + base.offsetX) * intensidadActual * factorRuido;
      let ruidoY = cos(frameCount * 0.03 + base.offsetY) * intensidadActual * factorRuido;

      fill(255, 255, 0, puntosAlpha);
      noStroke();
      ellipse(base.x + ruidoX, base.y + ruidoY, dotSize, dotSize);

      // Opcional: mostrar radio de influencia (para debugging)
      // if (i === 0) {
      //   noFill();
      //   stroke(255, 0, 0, 50);
      //   ellipse(mouseX, mouseY, radioInfluencia * 2);
      // }
    }
  }

  // Mostrar mensajes extra en pantalla
  if (mostrarPuntos && mensajesExtra.length > 0) {
    textFont(customFont);
    textAlign(CENTER);
    textSize(20);
    fill(255, 255, 0, puntosAlpha);

    let yPos = textAreaAndQuestionSize + (points.length > 0 ? points[points.length-1].y + 100 : 400);

    text("💡 MENSAJES EXTRA:", width/2, yPos);

    textSize(16);
    fill(255, 200);
    mensajesExtra.forEach((msg, index) => {
      text(`${index + 1}. ${msg}`, width/2, yPos + 40 + (index * 30));
    });
  }

  // Mostrar estado actual
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`Estado: ${estadoActual} | Ruido: ${intensidadActual.toFixed(1)}`, 20, height - 30);
}

function inputToTextFast() {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
  points = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    let puntosOutline = customFont.textToPoints(lineas[i], posX, posY, tamanoFuente, {
      sampleFactor: 0.22,
      simplifyThreshold: 0
    });

    points = points.concat(puntosOutline);
  }
}

async function iniciarProcesoCompleto() {
  if (generando) return;

  generando = true;

  estadoActual = "desvaneciendo";
  console.log("🔜 Iniciando desvanecimiento...");
  createFadingLetters(miTextarea.value());

  await esperarDesvanecimiento();

  estadoActual = "procesando";
  console.log("🤖 Procesando con IA...");

  // ✅ HACER DESAPARECER EL BOTÓN DURANTE EL PROCESAMIENTO
  botonEnviar.style('opacity', '0');
  botonEnviar.style('transition', 'opacity 0.5s');

  // Esperar un poco para que se complete la transición
  await new Promise(resolve => setTimeout(resolve, 500));
  botonEnviar.hide();

  await generarTextosConIA();

  estadoActual = "mostrandoPuntos";
  console.log("🎯 Mostrando puntos...");
  mostrarPuntos = true;
  puntosAlpha = 0;

  generando = false;
}

function esperarDesvanecimiento() {
  return new Promise((resolve) => {
    const checkDesvanecimiento = () => {
      if (fadingLetters.length === 0) {
        resolve();
      } else {
        setTimeout(checkDesvanecimiento, 100);
      }
    };
    checkDesvanecimiento();
  });
}

function createFadingLetters(text) {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(text, anchoMaximo, tamanoFuente);

  fadingLetters = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    for (let j = 0; j < lineas[i].length; j++) {
      let char = lineas[i].charAt(j);
      if (char !== ' ') {
        textSize(tamanoFuente);
        textFont(customFont);
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

  miTextarea.value('');
  miTextarea.elt.blur();
}

// FUNCIÓN SIMPLIFICADA: Todo en una sola función
async function generarTextosConIA() {
  let textoOriginal = savedText;

  try {
    console.log("🔄 Generando 5 textos (3 principales + 2 extra)...");

    let todosLosTextos = [];
    const todosLosTipos = [
      'polarizar_negativo',
      'distorsion_publicitaria',
      'exagerar',
      'polarizar_positivo',
      'exagerar'
    ];

    // Generar TODOS los textos en una sola pasada
    for (let i = 0; i < 5; i++) {
      let textoGenerado = await distorsionadorTexto.distorsionarTexto(textoOriginal, todosLosTipos[i]);
      todosLosTextos.push(textoGenerado);
      console.log(`✅ Texto ${i+1} generado:`, textoGenerado);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Los primeros 3 son los principales con el patrón original en medio
    let textoCombinado = todosLosTextos[0] + " • " + textoOriginal + " • " +
      todosLosTextos[1] + " • " + textoOriginal + " • " +
      todosLosTextos[2];

    // Los últimos 2 son los mensajes "extra" que se mostrarán abajo
    mensajesExtra = [todosLosTextos[3], todosLosTextos[4]];

    console.log("🎲 Texto principal combinado:", textoCombinado);
    console.log("💡 Mensajes extra:", mensajesExtra);

    generarPuntosConRuido(textoCombinado);

  } catch (error) {
    console.error("❌ Error generando textos:", error);
    generarPuntosConRuido(textoOriginal);
  }
}

function generarPuntosConRuido(textoCombinado) {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(textoCombinado, anchoMaximo, tamanoFuente);
  points = [];
  puntosBase = [];

  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    let puntosOutline = customFont.textToPoints(lineas[i], posX, posY, tamanoFuente, {
      sampleFactor: 0.22,
      simplifyThreshold: 0
    });

    for (let punto of puntosOutline) {
      points.push(punto);
      puntosBase.push({
        x: punto.x,
        y: punto.y,
        offsetX: random(0, 1000),
        offsetY: random(0, 1000)
      });
    }
  }

  console.log("⭕ Puntos con ruido generados:", points.length, "puntos");
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