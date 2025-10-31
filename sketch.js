let miTextarea;
let myQuestion = "¿Qué te gustaría que alguien por fin entendiera?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let textosDistorsionados = [];
let savedText = "";
let textAreaAndQuestionSize = 0;
let tamanoFuente = 40;

let usarClarifai = false;
let clarifaiDetections = [];

let areaTexto = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  ancho: 0,
  alto: 0
};

let calibracion = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 0,
  calibrado: false
};

let generando = false;
let timeoutInput;
let lastProcessedText = "";
let textosGenerados = [];
let finalTexto = "";
let limite = 0.8;
let botonEnviar;
let fadingLetters = [];

// NUEVAS VARIABLES PARA TEXTO DISTORSIONADO
let mostrarTextos = false;
let textosAlpha = 0;
let estadoActual = "escribiendo";

// VARIABLES PARA EFECTOS DE TEXTO
let ruidoIntensidad = 15;
let mouseCerca = false;

// VARIABLES PARA DETECCIÓN DE ROSTRO
let video;
let caraX = 0;
let caraY = 0;
let caraDetectada = false;
let usarCara = true;
let blazeModel = null;
let modeloCargado = false;

let radio01 = 0;
let radio02 = 400;
let radio03 = 800;
let radio04 = 1200;
let radio05 = 1600;
let radio06 = 2000;
let radio07 = 2400;
let radio08 = 2800;
let radio09 = 3200;

// NUEVAS VARIABLES PARA EFECTOS VISUALES
let tiempo = 0;
let glitchIntensidad = 0;
let chromaticAberration = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  calibracion.minX = width * 0.1;
  calibracion.maxX = width * 0.9;
  calibracion.minY = height * 0.2;
  calibracion.maxY = height * 0.8;
  calibracion.calibrado = true;

  // Inicializar el modelo de IA de texto
  distorsionadorTexto.inicializar().then(exito => {
    if (exito) {
      console.log("✅ Modelo de IA de texto cargado y listo");
    } else {
      console.error("❌ No se pudo cargar el modelo de texto");
    }
  });

  // ✅ INICIALIZAR DETECCIÓN CON BLAZEFACE
  inicializarDeteccionBlazeFace();

  miTextarea = createElement('textarea');
  miTextarea.style('background-color', 'rgba(0,0,0,0)');
  miTextarea.attribute('placeholder', 'Escribe tu respuesta aquí...');
  miTextarea.style('caret-shape', 'block');
  miTextarea.style('caret-color', '#ffb158');
  miTextarea.style('outline', 'none');
  miTextarea.style('border', 'none');
  miTextarea.style('border-radius', '0px');
  miTextarea.style('padding', '10px');
  miTextarea.style('font-size', tamanoFuente + 'px');
  miTextarea.style('color', '#FFB158');
  miTextarea.style('font-weight', 'bold');
  miTextarea.style('font-family', customFont);
  miTextarea.attribute('autofocus', '');
  miTextarea.style('text-align', 'center');

  miTextarea.elt.addEventListener('input', function() {
    savedText = miTextarea.value();
    inputToTextFast();
  });

  botonEnviar = createButton('Enviar');
  botonEnviar.size(120, 120);
  botonEnviar.style('font-weight', 'bold');
  botonEnviar.style('font-family', customFont);
  botonEnviar.style('font-color', '#22001f');
  botonEnviar.style('background-color', '#e4279e');
  botonEnviar.style('color', 'white');
  botonEnviar.style('border', 'none');
  botonEnviar.style('border-radius', '200px');
  botonEnviar.style('font-size', '16px');
  botonEnviar.style('cursor', 'pointer');
  botonEnviar.style('transition', 'all 0.3s');
  botonEnviar.position(width / 2 - botonEnviar.width / 2, height - botonEnviar.height - 40);

  botonEnviar.elt.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#c81889';
    this.style.transform = 'scale(1.05)';
  });

  botonEnviar.elt.addEventListener('mouseout', function() {
    this.style.backgroundColor = '#e4279e';
    this.style.transform = 'scale(1)';
  });

  miTextarea.elt.focus();
  botonEnviar.mousePressed(iniciarProcesoCompleto);
}
async function inicializarDeteccionBlazeFace() {
  try {
    console.log("🚀 Inicializando BlazeFace...");

    if (typeof tf === 'undefined') {
      console.error("❌ TensorFlow.js no está cargado");
      setTimeout(inicializarDeteccionBlazeFace, 500);
      return;
    }

    if (typeof blazeface === 'undefined') {
      console.error("❌ BlazeFace no está cargado");
      setTimeout(inicializarDeteccionBlazeFace, 500);
      return;
    }

    try {
      blazeModel = await blazeface.load();
      modeloCargado = true;
      console.log("✅ BlazeFace cargado - Listo para detección rápida");
    } catch (error) {
      console.error("❌ Error cargando BlazeFace:", error);
      usarCara = false;
      return;
    }

    try {
      video = createCapture(VIDEO, {
        audio: false,
        video: {
          width: 128,
          height: 128,
          facingMode: 'user'
        }
      });
      video.hide();
      console.log("📷 Cámara inicializada para BlazeFace");

      setTimeout(() => {
        console.log("🎬 Iniciando detección rápida...");
        empezarDeteccionRapida();
      }, 500);

    } catch (error) {
      console.error("❌ Error inicializando cámara:", error);
      usarCara = false;
    }

  } catch (error) {
    console.error("❌ Error crítico en inicialización:", error);
    console.log("🖱️ Usando mouse como fallback");
    usarCara = false;
    modeloCargado = false;
  }
}

async function empezarDeteccionRapida() {
  if (!modeloCargado || !blazeModel || !video) {
    console.log("⏳ Modelo no listo, reintentando...");
    setTimeout(empezarDeteccionRapida, 500);
    return;
  }

  try {
    const predictions = await blazeModel.estimateFaces(video.elt, false);

    if (predictions && predictions.length > 0) {
      const prediction = predictions[0];
      const topLeft = prediction.topLeft;
      const bottomRight = prediction.bottomRight;

      const centerX = (topLeft[0] + bottomRight[0]) / 2;
      const centerY = (topLeft[1] + bottomRight[1]) / 2;

      caraX = map(centerX, 0, video.width, calibracion.minX, calibracion.maxX);
      caraY = map(centerY, 0, video.height, calibracion.minY, calibracion.maxY);

      caraDetectada = true;

    } else {
      caraDetectada = false;
    }
  } catch (error) {
    console.error("❌ Error en detección:", error);
    caraDetectada = false;
  }

  setTimeout(empezarDeteccionRapida, 100);
}

function preload() {
  customFont = loadFont('assets/fonts/Montserrat-Regular.ttf');
}

function draw() {
  background('#000000');
  tiempo += 0.005; // Más rápido para efectos más dinámicos

  // Actualizar efectos
  actualizarEfectos();

  // Dibujar elementos de fondo
  dibujarElementosFondo();

  // TEXTO PRINCIPAL (pregunta)
  textFont(customFont);
  textAlign(CENTER, TOP);
  textSize(questionSize);
  fill('#e4279e');

  let lineasInfo = obtenerLineasTexto(myQuestion, width);
  lineasGeneradas = lineasInfo.length;
  text(myQuestion, (width / 2) - (width / 2) / 2, questionSize, width/2, height);

  // Posicionar textarea
  miTextarea.position((width / 4) - (width / 4) / 4, (height / 2 - questionSize) - miTextarea.elt.scrollHeight/ questionSize * 15);
  miTextarea.size(width * 0.66, inputFontSize * .2);
  miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');

  if (estadoActual === "escribiendo") {
    miTextarea.elt.focus();
  }

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;

  // Mostrar letras que se desvanecen
  mostrarLetrasDesvanecientes();

  // DECIDIR SI USAR CARA O MOUSE
  let posicionX, posicionY;

  if (usarCara && caraDetectada) {
    posicionX = caraX;
    posicionY = caraY;

    if (areaTexto.ancho > 0 && areaTexto.alto > 0) {
      posicionX = constrain(posicionX, areaTexto.minX, areaTexto.maxX);
      posicionY = constrain(posicionY, areaTexto.minY, areaTexto.maxY);
    } else {
      posicionX = constrain(posicionX, 0, width);
      posicionY = constrain(posicionY, 0, height);
    }
  } else {
    posicionX = mouseX;
    posicionY = mouseY;
  }

  // Mostrar textos distorsionados
  if (mostrarTextos && textosDistorsionados.length > 0) {
    if (textosAlpha < 255) {
      textosAlpha += 3;
    }

    dibujarTextosDistorsionados(posicionX, posicionY);
  }

  // Mostrar estado actual
  fill(255);
  textSize(16);
  textAlign(LEFT);
  let estadoCara = usarCara ? (caraDetectada ? "Cara ✅" : "Buscando rostro...") : "Mouse";
  text(`Estado: ${estadoActual} | Control: ${estadoCara}`, 20, height - 30);

  // DEBUG VISUAL
  if (mostrarTextos) {
    dibujarDebugVisual(posicionX, posicionY);
  }
}

function actualizarEfectos() {
  // Actualizar intensidad del glitch basado en movimiento
  let velocidad = dist(pmouseX, pmouseY, mouseX, mouseY);
  glitchIntensidad = lerp(glitchIntensidad, min(velocidad * 0.8, 30), 0.1); // Más intenso
  chromaticAberration = lerp(chromaticAberration, glitchIntensidad * 0.5, 0.1); // Más aberración
}

function dibujarElementosFondo() {
  // Líneas
  push();
  strokeWeight(1);
  stroke('rgba(255,60,60,0.49)');
  line(0, 0, width, height);
  line(width, 0, 0, height);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
  pop();

  // Círculos concéntricos
  push();
  strokeWeight(1);
  stroke('rgba(37,109,254,0.51)');
  noFill();
  ellipse(width/2, height/2, int(radio01), int(radio01));
  ellipse(width/2, height/2, int(radio02), int(radio02));
  ellipse(width/2, height/2, int(radio03), int(radio03));
  ellipse(width/2, height/2, int(radio04), int(radio04));
  ellipse(width/2, height/2, int(radio05), int(radio05));
  ellipse(width/2, height/2, int(radio06), int(radio06));
  ellipse(width/2, height/2, int(radio07), int(radio07));
  ellipse(width/2, height/2, int(radio08), int(radio08));
  ellipse(width/2, height/2, int(radio09), int(radio09));
  pop();

  // Animar radios
  radio01 = (radio01 + 1) % 3600;
  radio02 = (radio02 + 1) % 3600;
  radio03 = (radio03 + 1) % 3600;
  radio04 = (radio04 + 1) % 3600;
  radio05 = (radio05 + 1) % 3600;
  radio06 = (radio06 + 1) % 3600;
  radio07 = (radio07 + 1) % 3600;
  radio08 = (radio08 + 1) % 3600;
  radio09 = (radio09 + 1) % 3600;
}

function mostrarLetrasDesvanecientes() {
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
}

function dibujarTextosDistorsionados(posX, posY) {
  for (let i = 0; i < textosDistorsionados.length; i++) {
    let textoObj = textosDistorsionados[i];

    // Efectos basados en la posición del mouse/cara
    let distancia = dist(posX, posY, textoObj.x, textoObj.y);
    let influencia = map(distancia, 0, 400, 1.5, 0, true); // Más influencia

    // Aplicar efectos individuales
    aplicarEfectosTexto(textoObj, influencia, i);
  }
}

function aplicarEfectosTexto(textoObj, influencia, index) {
  push();

  // Configuración base del texto
  textFont(customFont);
  textAlign(textoObj.align, textoObj.baseline);

  // POSICIÓN CENTRALIZADA MEJORADA
  let centroX = width/2 + (textoObj.x - width/2) * 0.8; // Empujar hacia el centro
  let centroY = height/2 + (textoObj.y - height/2) * 0.8;

  // Movimiento orgánico más exagerado
  let offsetX = sin(tiempo * textoObj.velocidad * 1.5 + index * 0.7) * textoObj.amplitud * 1.5;
  let offsetY = cos(tiempo * textoObj.velocidad * 1.2 + index * 0.9) * textoObj.amplitud * 1.2;

  let xFinal = centroX + offsetX;
  let yFinal = centroY + offsetY;

  // ROTACIÓN MUCHO MÁS EXAGERADA
  let rotacionBase = textoObj.rotacion;
  let rotacionDinamica = sin(tiempo * textoObj.velocidad * 2 + index) * textoObj.rotacionMaxima;
  let rotacionTotal = rotacionBase + rotacionDinamica;

  translate(xFinal, yFinal);
  rotate(rotacionTotal);

  // Efectos de distorsión individuales MEJORADOS
  if (textoObj.efecto === 'glitch') {
    aplicarEfectoGlitch(textoObj, 0, 0, influencia);
  } else if (textoObj.efecto === 'outline') {
    aplicarEfectoOutline(textoObj, 0, 0, influencia);
  } else if (textoObj.efecto === 'chromatic') {
    aplicarEfectoChromatic(textoObj, 0, 0, influencia);
  } else if (textoObj.efecto === 'wave') {
    aplicarEfectoWave(textoObj, 0, 0, influencia);
  } else if (textoObj.efecto === 'curve') {
    aplicarEfectoCurva(textoObj, 0, 0, influencia);
  } else if (textoObj.efecto === 'taper') {
    aplicarEfectoTaper(textoObj, 0, 0, influencia);
  } else {
    aplicarEfectoDefault(textoObj, 0, 0, influencia);
  }

  pop();
}

// NUEVO EFECTO: TEXTO EN CURVA ORGÁNICA
function aplicarEfectoCurva(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;
  let tamano = textoObj.tamano;
  let chars = textoObj.texto.split('');

  // Definir curva orgánica tipo "S"
  let radioCurva = tamano * 2 * influencia;
  let anguloInicial = tiempo * 0.5;

  // ⭐⭐ NUEVO: CONTROL DE SEPARACIÓN ⭐⭐
  let separacionBase = tamano * 1.2; // ← AJUSTA ESTE VALOR (1.2 = 120% del tamaño)
  let separacionExtra = 5; // ← SEPARACIÓN ADICIONAL EN PÍXELES

  for (let i = 0; i < chars.length; i++) {
    let progreso = i / (chars.length - 1);

    // Curva suave en S
    let angulo = anguloInicial + progreso * PI;
    let curvaX = sin(angulo) * radioCurva;
    let curvaY = cos(angulo * 0.7) * radioCurva * 0.5;

    // ⭐⭐ CÁLCULO DE POSICIÓN CON MÁS SEPARACIÓN ⭐⭐
    let espaciadoTotal = separacionBase + separacionExtra;
    let charX = curvaX + (i - chars.length/2) * espaciadoTotal;
    let charY = curvaY;

    // Rotación individual de cada carácter
    let rotacionChar = sin(angulo + tiempo) * 0.3;

    push();
    translate(charX, charY);
    rotate(rotacionChar);

    // Alternar entre fill y stroke
    if (random() > 0.3) {
      fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha * 0.8);
      noStroke();
    } else {
      noFill();
      stroke(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
      strokeWeight(2);
    }

    textSize(tamano * (0.8 + sin(progreso * PI) * 0.4));
    text(chars[i], 0, 0);
    pop();
  }
}

// NUEVO EFECTO: TAPER CON GRADIENTE DE TAMAÑO
function aplicarEfectoTaper(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;
  let tamanoBase = textoObj.tamano;
  let chars = textoObj.texto.split('');

  for (let i = 0; i < chars.length; i++) {
    let progreso = i / (chars.length - 1);

    // Efecto taper: más grande en el centro
    let scaleFactor = sin(progreso * PI) * 0.6 + 0.4;
    let tamanoActual = tamanoBase * scaleFactor;

    // Posición con espaciado variable
    let charX = x + (i - chars.length/2) * tamanoBase * 0.6;

    push();

    // Solo stroke para algunos caracteres
    if (i % 3 === 0) {
      noFill();
      stroke(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
      strokeWeight(3);
    } else {
      noStroke();
      fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha * 0.9);
    }

    // Rotación individual exagerada
    rotate(sin(tiempo * 3 + i) * 0.5);

    textSize(tamanoActual);
    text(chars[i], charX, y + sin(tiempo * 2 + i) * 10);
    pop();
  }
}

function aplicarEfectoGlitch(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;

  // Texto principal con glitch MÁS EXAGERADO
  fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
  textSize(textoObj.tamano);
  text(textoObj.texto, x, y);

  // Efectos de glitch aleatorios MÁS FRECUENTES
  if (random() < 0.5 * influencia) {
    let glitchX = x + random(-glitchIntensidad * 2, glitchIntensidad * 2);
    let glitchY = y + random(-glitchIntensidad, glitchIntensidad);

    // Capas de glitch con colores contrastantes
    fill(255, 0, 0, alpha * 0.8);
    text(textoObj.texto, glitchX, glitchY);

    fill(0, 255, 255, alpha * 0.6);
    text(textoObj.texto, glitchX + 4, glitchY - 4);
  }
}

function aplicarEfectoOutline(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;
  let tamano = textoObj.tamano;

  // Outline MÁS GRUESO
  stroke(255, 255, 0, alpha);
  strokeWeight(4);
  noFill();
  textSize(tamano);
  text(textoObj.texto, x, y);

  // Relleno con efecto de parpadeo MÁS RÁPIDO
  if (sin(tiempo * 8) > 0) {
    noStroke();
    fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha * 0.4);
    text(textoObj.texto, x, y);
  }
}

function aplicarEfectoChromatic(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;
  let tamano = textoObj.tamano;
  let aberration = chromaticAberration * influencia * 2; // MÁS ABERRACIÓN

  // Capas de aberración cromática MÁS SEPARADAS
  fill(255, 0, 0, alpha * 0.9);
  textSize(tamano);
  text(textoObj.texto, x - aberration * 1.5, y);

  fill(0, 255, 0, alpha * 0.9);
  text(textoObj.texto, x, y + aberration * 0.5);

  fill(0, 0, 255, alpha * 0.9);
  text(textoObj.texto, x + aberration * 1.5, y - aberration * 0.5);

  // Capa principal SOLO STROKE
  noFill();
  stroke(255, alpha);
  strokeWeight(1);
  text(textoObj.texto, x, y);
}

function aplicarEfectoWave(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;
  let tamano = textoObj.tamano;

  // Efecto de onda en el texto MÁS EXAGERADO
  let chars = textoObj.texto.split('');
  for (let i = 0; i < chars.length; i++) {
    let charX = x + textWidth(textoObj.texto.substring(0, i));
    let waveOffset = sin(tiempo * 4 + i * 0.7) * 15 * influencia; // MÁS AMPLITUD

    // Alternar entre fill y stroke
    if (i % 2 === 0) {
      noStroke();
      fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
    } else {
      noFill();
      stroke(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
      strokeWeight(2);
    }

    textSize(tamano + sin(tiempo * 3 + i) * 8); // MÁS VARIACIÓN DE TAMAÑO
    text(chars[i], charX, y + waveOffset);
  }
}

function aplicarEfectoDefault(textoObj, x, y, influencia) {
  let alpha = textosAlpha * textoObj.opacidad;

  // Efecto base con distorsión MÁS EXAGERADA
  if (random() > 0.4) {
    fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
  } else {
    noFill();
    stroke(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
    strokeWeight(2);
  }

  textSize(textoObj.tamano);

  // ROTACIÓN MUCHO MÁS EXAGERADA
  let rotacionExtra = sin(tiempo * 3) * 0.8 * influencia;
  rotate(rotacionExtra);

  text(textoObj.texto, x, y);
}

function dibujarDebugVisual(posX, posY) {
  // Área del texto
  noFill();
  stroke(255, 0, 0, 80);
  strokeWeight(1);
  rect(areaTexto.minX, areaTexto.minY, areaTexto.ancho, areaTexto.alto);

  // Posición actual
  fill(0, 255, 0, 150);
  noStroke();
  ellipse(posX, posY, 12, 12);

  // Centro del canvas
  fill(255, 0, 255, 100);
  ellipse(width/2, height/2, 8, 8);

  // Info de debug
  fill(255);
  textSize(12);
  textAlign(LEFT);
  text(`Textos: ${textosDistorsionados.length}`, 20, height - 80);
  text(`Alpha: ${textosAlpha.toFixed(0)}`, 20, height - 65);
  text(`Glitch: ${glitchIntensidad.toFixed(1)}`, 20, height - 50);
  text(`Rotación MAX: ${max(...textosDistorsionados.map(t => t.rotacionMaxima)).toFixed(2)}`, 20, height - 35);
}
function inputToTextFast() {
  // Esta función ya no genera puntos, solo procesa el texto
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
  // No hacemos nada con points[] ya que fue eliminado
}

async function iniciarProcesoCompleto() {
  if (generando) return;
  generando = true;

  estadoActual = "desvaneciendo";
  createFadingLetters(miTextarea.value());
  await esperarDesvanecimiento();

  estadoActual = "procesando";
  botonEnviar.style('opacity', '0');
  botonEnviar.style('transition', 'opacity 0.5s');
  miTextarea.attribute('placeholder', '');

  await new Promise(resolve => setTimeout(resolve, 500));
  botonEnviar.hide();

  await generarTextosConIA();

  estadoActual = "mostrandoTextos";
  mostrarTextos = true;
  textosAlpha = 0;

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

  let textareaPosX = (width / 4) - (width / 4) / 4;
  let textareaPosY = (height / 2 - questionSize) - miTextarea.elt.scrollHeight / questionSize * 15;

  for (let i = 0; i < lineas.length; i++) {
    let posY = textareaPosY + (i * tamanoFuente * 1.2);
    let anchoLinea = textWidth(lineas[i]);
    let posX = textareaPosX + (width * 0.66 - anchoLinea) / 2;

    for (let j = 0; j < lineas[i].length; j++) {
      let char = lineas[i].charAt(j);
      if (char !== ' ') {
        textSize(tamanoFuente);
        textFont(customFont);

        let charX = posX + textWidth(lineas[i].substring(0, j));
        let charY = posY;

        fadingLetters.push({
          char: char,
          x: charX,
          y: charY,
          alpha: 255,
          fadeSpeed: random(2, 5),
          floatSpeed: random(0.2, 0.5),
          size: tamanoFuente,
          color: color(255, 177, 88),
          font: customFont
        });
      }
    }
  }

  miTextarea.value('');
  miTextarea.elt.blur();
}

async function generarTextosConIA() {
  let textoOriginal = savedText;

  try {
    console.log("🔄 Generando textos distorsionados...");

    let todosLosTextos = [];
    const todosLosTipos = [
      'polarizar_negativo', 'distorsion_publicitaria', 'exagerar',
      'polarizar_positivo', 'exagerar', 'polarizar_negativo',
      'polarizar_negativo', 'polarizar_positivo', 'distorsion_publicitaria',
      'exagerar', 'polarizar_negativo', 'distorsion_publicitaria', 'polarizar_positivo'
    ];

    for (let i = 0; i < 13; i++) {
      let textoGenerado = await distorsionadorTexto.distorsionarTexto(textoOriginal, todosLosTipos[i]);
      todosLosTextos.push(textoGenerado);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Combinar textos
    let textoCombinado = todosLosTextos.join(" ") + " " + textoOriginal;
    generarTextosVisuales(textoCombinado, todosLosTextos);

  } catch (error) {
    console.error("❌ Error generando textos:", error);
    generarTextosVisuales(savedText, [savedText]);
  }
}

function generarTextosVisuales(textoCompleto, textosIndividuales) {
  textosDistorsionados = [];

  // Configurar área de texto MÁS CENTRALIZADA
  areaTexto.minX = width * 0.15;  // Más estrecho
  areaTexto.maxX = width * 0.85;
  areaTexto.minY = height * 0.25; // Más centrado verticalmente
  areaTexto.maxY = height * 0.75;
  areaTexto.ancho = areaTexto.maxX - areaTexto.minX;
  areaTexto.alto = areaTexto.maxY - areaTexto.minY;

  // Crear textos individuales con efectos únicos MEJORADOS
  let efectos = ['glitch', 'outline', 'chromatic', 'wave', 'curve', 'taper', 'default'];
  let colores = [
    color(255, 50, 50),    // Rojo
    color(50, 255, 50),    // Verde
    color(50, 50, 255),    // Azul
    color(255, 255, 50),   // Amarillo
    color(255, 50, 255),   // Magenta
    color(50, 255, 255),   // Cian
    color(255, 150, 50),   // Naranja
    color(150, 50, 255)    // Púrpura
  ];

  for (let i = 0; i < textosIndividuales.length; i++) {
    let texto = textosIndividuales[i];
    if (texto.length < 3) continue; // Textos más cortos permitidos

    let textoObj = {
      texto: texto,
      x: random(areaTexto.minX, areaTexto.maxX),
      y: random(areaTexto.minY, areaTexto.maxY),
      tamano: random(15, 45), // Tamaños más variados
      color: random(colores),
      opacidad: random(0.6, 1.0),
      efecto: random(efectos),
      velocidad: random(0.3, 1.0),  // Más rápido
      amplitud: random(10, 50), // Más amplitud
      align: random(['LEFT', 'CENTER', 'RIGHT']),
      baseline: random(['TOP', 'MIDDLE', 'BOTTOM']),
      rotacion: random(-0.3, 0.3),
      rotacionMaxima: random(0.5, 1.5) // ROTACIONES MUCHO MÁS EXAGERADAS
    };

    textosDistorsionados.push(textoObj);
  }

  console.log("🎨 Textos visuales generados:", textosDistorsionados.length);
  console.log("🌀 Efectos aplicados:", textosDistorsionados.map(t => t.efecto));
}

// Funciones auxiliares que se mantienen igual
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

function mousePressed() {
  if (mouseButton === LEFT) {
    usarCara = !usarCara;
    console.log(usarCara ? "🔄 Usando detección de cara" : "🖱️ Usando mouse");
    return false;
  }
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    resetearInterfaz();
    return false;
  }
}

function resetearInterfaz() {
  estadoActual = "escribiendo";
  mostrarTextos = false;
  textosAlpha = 0;
  textosDistorsionados = [];
  miTextarea.value('');
  miTextarea.elt.focus();

  botonEnviar.show();
  botonEnviar.style('opacity', '1');

  console.log("🔄 Interfaz reseteada");
}