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

// VARIABLES PARA DETECCIÓN DE ROSTRO (FACE-API.JS)
let video;
let narizX = 0;
let narizY = 0;
let narizDetectada = false;
let usarNariz = true;
let modelosCargados = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Inicializar el modelo de IA de texto
  distorsionadorTexto.inicializar().then(exito => {
    if (exito) {
      console.log("✅ Modelo de IA de texto cargado y listo");
    } else {
      console.error("❌ No se pudo cargar el modelo de texto");
    }
  });

  // Inicializar cámara y detección facial
  inicializarDeteccionFacial();

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

async function inicializarDeteccionFacial() {
  try {
    console.log("🔄 Cargando modelos de detección facial...");

    const modelPath = './models';
    console.log("📁 Ruta de modelos:", modelPath);

    // 🔧 SOLUCIÓN: Cargar modelos con manejo de errores individual
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
      console.log("✅ TinyFaceDetector cargado");
    } catch (error) {
      console.error("❌ Error cargando TinyFaceDetector:", error);
      throw error;
    }

    try {
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
      console.log("✅ FaceLandmark68Net cargado");
    } catch (error) {
      console.error("❌ Error cargando FaceLandmark68Net:", error);
      throw error;
    }

    modelosCargados = true;
    console.log("✅ Todos los modelos de detección facial cargados");

    // Inicializar cámara con mejor manejo de errores
    try {
      video = createCapture(VIDEO);
      video.size(320, 240);
      video.hide();
      console.log("📷 Cámara inicializada");
    } catch (error) {
      console.error("❌ Error inicializando cámara:", error);
      throw error;
    }

    // Esperar un momento para que la cámara se inicialice
    setTimeout(() => {
      console.log("🎬 Iniciando detección facial...");
      empezarDeteccion();
    }, 1000);

  } catch (error) {
    console.error("❌ Error crítico en inicialización facial:", error);
    console.log("🖱️ Usando mouse como fallback");
    usarNariz = false;
    modelosCargados = false;
  }
}


async function empezarDeteccion() {
  if (!modelosCargados || !video) return;

  try {
    // 🔧 SOLUCIÓN: Agregar más opciones de configuración y manejo de errores
    const opcionesDeteccion = new faceapi.TinyFaceDetectorOptions({
      inputSize: 160, // Tamaño óptimo para tinyFaceDetector
      scoreThreshold: 0.5 // Umbral de confianza
    });

    const detecciones = await faceapi
      .detectAllFaces(video.elt, opcionesDeteccion)
      .withFaceLandmarks();

    if (detecciones && detecciones.length > 0) {
      const landmarks = detecciones[0].landmarks;
      const nariz = landmarks.getNose();

      // Calcular centro de la nariz
      let sumaX = 0, sumaY = 0;
      for (let punto of nariz) {
        sumaX += punto.x;
        sumaY += punto.y;
      }

      narizX = map(sumaX / nariz.length, 0, video.width, 0, width);
      narizY = map(sumaY / nariz.length, 0, video.height, 0, height);
      narizDetectada = true;

      console.log("👃 Nariz detectada en:", narizX.toFixed(0), narizY.toFixed(0));
    } else {
      narizDetectada = false;
      console.log("🔍 Buscando rostro...");
    }
  } catch (error) {
    console.error("❌ Error en detección:", error);
    narizDetectada = false;
    // Si hay error continuo, desactivar detección facial
    if (error.message.includes('failed') || error.message.includes('load')) {
      console.log("🔄 Desactivando detección facial debido a errores continuos");
      usarNariz = false;
    }
  }

  // Continuar detección (más lento si hay errores)
  setTimeout(empezarDeteccion, narizDetectada ? 100 : 500);
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

  // DECIDIR SI USAR NARIZ O MOUSE
  let posicionX, posicionY;

  if (usarNariz && narizDetectada) {
    // ✅ USAR POSICIÓN DE LA NARIZ CON CONSTRAINTS
    posicionX = constrain(narizX, 0, width);
    posicionY = constrain(narizY, 0, height);

    // Debug de coordenadas de nariz
    if (frameCount % 60 === 0) { // Mostrar cada segundo aproximadamente
      console.log("👃 Coordenadas nariz - Raw:", narizX.toFixed(0), narizY.toFixed(0),
        "Constrained:", posicionX.toFixed(0), posicionY.toFixed(0));
    }
  } else {
    // ✅ USAR MOUSE (fallback)
    posicionX = mouseX;
    posicionY = mouseY;
  }

  // ✅ LÓGICA MEJORADA: Calcular intensidad basada en posición X e Y
  let intensidadActual = ruidoIntensidad; // Valor por defecto (máximo ruido)

  // Definir área del texto (usando tus valores que funcionan con mouse)
  let textoStartX = width/5;          // Aprox 300-400 en pantalla normal
  let textoEndX = width/5 + width * 0.65; // Aprox 1000-1200
  let textoStartY = textAreaAndQuestionSize; // Donde empieza el texto
  let textoEndY = textAreaAndQuestionSize + (points.length > 0 ? points[points.length-1].y + 50 : height);

  // Verificar si está sobre el área del texto
  let estaSobreTexto = posicionX > textoStartX && posicionX < textoEndX &&
    posicionY > textoStartY && posicionY < textoEndY;

  if (estaSobreTexto) {
    // ✅ CALCULAR INTENSIDAD BASADA EN POSICIÓN X (horizontal) - 70% de influencia
    let centroX = textoStartX + (textoEndX - textoStartX) / 2;
    let distanciaX = abs(posicionX - centroX);
    let maxDistanciaX = (textoEndX - textoStartX) / 2;
    let intensidadX = map(distanciaX, 0, maxDistanciaX, 2, ruidoIntensidad);

    // ✅ CALCULAR INTENSIDAD BASADA EN POSICIÓN Y (vertical) - 30% de influencia
    let centroY = textoStartY + (textoEndY - textoStartY) / 2;
    let distanciaY = abs(posicionY - centroY);
    let maxDistanciaY = (textoEndY - textoStartY) / 2;
    let intensidadY = map(distanciaY, 0, maxDistanciaY, 2, ruidoIntensidad);

    // ✅ COMBINAR AMBAS INTENSIDADES (70% X, 30% Y)
    intensidadActual = (intensidadX * 0.7) + (intensidadY * 0.3);

    // Asegurar que no se salga de los límites
    intensidadActual = constrain(intensidadActual, 2, ruidoIntensidad);
  }

  // Mostrar puntos con efecto de ruido
  if (mostrarPuntos && points.length > 0 && puntosBase.length === points.length) {
    if (puntosAlpha < 255) {
      puntosAlpha += 3;
    }

    for (let i = 0; i < points.length; i++) {
      let base = puntosBase[i];

      // Calcular distancia para efecto localizado (usando ambas coordenadas)
      let distancia = dist(posicionX, posicionY, base.x, base.y);
      let radioInfluencia = 180; // Aumentado un poco para mejor cobertura

      let factorRuido = 1.0;

      if (distancia < radioInfluencia) {
        let t = map(distancia, 0, radioInfluencia, 0, 1);
        factorRuido = pow(t, 1.5); // Suavizado
      }

      let ruidoX = sin(frameCount * 0.05 + base.offsetX) * intensidadActual * factorRuido;
      let ruidoY = cos(frameCount * 0.03 + base.offsetY) * intensidadActual * factorRuido;

      fill(255, 255, 0, puntosAlpha);
      noStroke();
      ellipse(base.x + ruidoX, base.y + ruidoY, dotSize, dotSize);
    }
  }

  // Mostrar estado actual (indicar si está usando nariz)
  fill(255);
  textSize(16);
  textAlign(LEFT);
  let estadoNariz = usarNariz ? (narizDetectada ? "Nariz ✅" : "Buscando rostro...") : "Mouse";
  text(`Estado: ${estadoActual} | Control: ${estadoNariz}`, 20, height - 30);

  // DEBUG VISUAL MEJORADO
  if (mostrarPuntos) {
    // Área del texto
    noFill();
    stroke(255, 0, 0, 80);
    strokeWeight(1);
    rect(textoStartX, textoStartY, textoEndX - textoStartX, textoEndY - textoStartY);

    // Cruz central
    stroke(0, 255, 0, 60);
    let centroX = textoStartX + (textoEndX - textoStartX) / 2;
    let centroY = textoStartY + (textoEndY - textoStartY) / 2;
    line(centroX, textoStartY, centroX, textoEndY); // Línea vertical
    line(textoStartX, centroY, textoEndX, centroY); // Línea horizontal

    // Punto central
    fill(0, 255, 0, 80);
    noStroke();
    ellipse(centroX, centroY, 8, 8);

    // Posición actual (nariz o mouse)
    fill(0, 255, 0, 150);
    noStroke();
    ellipse(posicionX, posicionY, 12, 12);

    // Línea desde posición actual al centro
    stroke(255, 255, 0, 100);
    strokeWeight(1);
    line(posicionX, posicionY, centroX, centroY);

    // Texto de debug MEJORADO
    fill(255);
    textSize(12);
    textAlign(LEFT);
    text(`X: ${posicionX.toFixed(0)} | Y: ${posicionY.toFixed(0)}`, 20, height - 80);
    text(`Intensidad: ${intensidadActual.toFixed(1)}`, 20, height - 65);
    text(`Sobre texto: ${estaSobreTexto ? "SÍ ✅" : "NO ❌"}`, 20, height - 50);
    text(`Rango X: ${textoStartX.toFixed(0)}-${textoEndX.toFixed(0)}`, 20, height - 35);
    text(`Rango Y: ${textoStartY.toFixed(0)}-${textoEndY.toFixed(0)}`, 20, height - 20);
  }

  // Mostrar indicador de posición de nariz/mouse (debug original)
  if (estaSobreTexto && (usarNariz || mouseIsPressed)) {
    fill(255, 0, 0, 100);
    noStroke();
    ellipse(posicionX, posicionY, 20, 20);
  }
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

    console.log("🎲 Texto principal combinado:", textoCombinado);

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

function mousePressed() {
  // Verificar si es click secundario (botón derecho)
  if (mouseButton === LEFT) {
    // Cambiar entre nariz y mouse
    usarNariz = !usarNariz;
    console.log(usarNariz ? "🔄 Usando detección de nariz" : "🖱️ Usando mouse");
    return false; // Prevenir el menú contextual del navegador
  }
}

function keyPressed() {
  // Presiona ESC para resetear (opcional)
  if (keyCode === ESCAPE) {
    resetearInterfaz();
    return false;
  }
}

// Función para resetear la interfaz
function resetearInterfaz() {
  estadoActual = "escribiendo";
  mostrarPuntos = false;
  puntosAlpha = 0;
  points = [];
  puntosBase = [];
  miTextarea.value('');
  miTextarea.elt.focus();

  // Mostrar el botón nuevamente
  botonEnviar.show();
  botonEnviar.style('opacity', '1');

  console.log("🔄 Interfaz reseteada");
}

// Función para verificar que los modelos sean accesibles
async function verificarModelos() {
  const archivosRequeridos = [
    './models/tiny_face_detector_model-weights_manifest.json',
    './models/tiny_face_detector_model-shard1',
    './models/face_landmark_68_model-weights_manifest.json',
    './models/face_landmark_68_model-shard1'
  ];

  for (let archivo of archivosRequeridos) {
    try {
      const response = await fetch(archivo);
      console.log(`📄 ${archivo}: ${response.status === 200 ? '✅ OK' : '❌ No encontrado'}`);
    } catch (error) {
      console.error(`❌ Error accediendo a ${archivo}:`, error);
    }
  }
}

// Llama esta función al inicio del setup
// Agrega esto al final de tu función setup():
// verificarModelos();