let miTextarea;
let myQuestion = "¿Qué te gustaría que alguien por fin entendiera?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let points = [];
let savedText = "";
let textAreaAndQuestionSize = 0;
let tamanoFuente = 40;
let dotSize = 4;

let puntosBuffer;
let puntosBufferDirty = true;


let usarClarifai = false;
let clarifaiDetections = [];

let areaPuntos = {
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

  // ✅ INICIALIZAR DETECCIÓN CON BLAZEFACE (MÁS RÁPIDO)
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

  // DEBOUNCE HÍBRIDO
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
    console.log("🚀 Inicializando BlazeFace (más rápido)...");

    // CARGAR TENSORFLOW.JS Y BLAZEFACE
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

    // CARGAR MODELO BLAZEFACE
    try {
      blazeModel = await blazeface.load();
      modeloCargado = true;
      console.log("✅ BlazeFace cargado - Listo para detección rápida");
    } catch (error) {
      console.error("❌ Error cargando BlazeFace:", error);
      usarCara = false;
      return;
    }

    // INICIALIZAR CÁMARA
    try {
      video = createCapture(VIDEO, {
        audio: false,
        video: {
          width: 128,  // Mínimo necesario para buena detección
          height: 128,
          facingMode: 'user'
        }
      });
      video.hide();
      console.log("📷 Cámara inicializada para BlazeFace");

      // Esperar un momento y empezar detección
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
    // ✅ DETECCIÓN CON BLAZEFACE
    const predictions = await blazeModel.estimateFaces(video.elt, false);

    if (predictions && predictions.length > 0) {
      const prediction = predictions[0];

      // BlazeFace devuelve las coordenadas de la caja
      const topLeft = prediction.topLeft;
      const bottomRight = prediction.bottomRight;

      // Calcular centro de la cara
      const centerX = (topLeft[0] + bottomRight[0]) / 2;
      const centerY = (topLeft[1] + bottomRight[1]) / 2;

      console.log("🔍 Coordenadas originales:", {centerX, centerY, videoWidth: video.width, videoHeight: video.height});

      // Mapear a coordenadas del canvas
      caraX = map(centerX, 0, video.width, calibracion.minX, calibracion.maxX);
      caraY = map(centerY, 0, video.height, calibracion.minY, calibracion.maxY);

      caraDetectada = true;

      // Debug cada segundo
      if (frameCount % 60 === 0) {
        console.log("⚡ Cara detectada - Posición:",
          Math.round(caraX), Math.round(caraY),
          "Confianza:", prediction.probability ? prediction.probability[0].toFixed(3) : "N/A");
      }
    } else {
      caraDetectada = false;
      if (frameCount % 120 === 0) {
        console.log("🔍 No se detectaron caras en el frame");
      }
    }
  } catch (error) {
    console.error("❌ Error en detección:", error);
    caraDetectada = false;
  }

  // Ciclo de detección más rápido
  setTimeout(empezarDeteccionRapida, 100); // 10 FPS para empezar
}

function preload() {
  customFont = loadFont('assets/fonts/Montserrat-Regular.ttf');
}

function draw() {
  background('#000000');

  //dibujar linea
  push();
  strokeWeight(1);
  stroke('rgba(255,60,60,0.49)');
  line(0, 0, width, height);
  line(width, 0, 0, height);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);
  pop();

  //dibujar linea
  push();
  strokeWeight(1);
  stroke('rgba(37,109,254,0.51)');
  noFill();
  ellipse(width/2, height/2, int(radio01 ), int(radio01 ));
  ellipse(width/2, height/2, int(radio02 ), int(radio02 ));
  ellipse(width/2, height/2, int(radio03 ), int(radio03 ));
  ellipse(width/2, height/2, int(radio04 ), int(radio04 ));
  ellipse(width/2, height/2, int(radio05 ), int(radio05 ));
  ellipse(width/2, height/2, int(radio06 ), int(radio06 ));
  ellipse(width/2, height/2, int(radio07 ), int(radio07));
  ellipse(width/2, height/2, int(radio08 ), int(radio08));
  ellipse(width/2, height/2, int(radio09 ), int(radio09));
  pop();

  radio01 = radio01 + 1;
  radio02 = radio02 + 1;
  radio03 = radio03 + 1;
  radio04 = radio04 + 1;
  radio05 = radio05 + 1;
  radio06 = radio06 + 1;
  radio07 = radio07 + 1;
  radio08 = radio08 + 1;
  radio09 = radio09 + 1;

  if(radio01 > 3600) {
    radio01 = 0;
  }
  if(radio02 > 3600) {
    radio02 = 0;
  }
  if(radio03 > 3600) {
    radio03 = 0;
  }
  if(radio04 > 3600) {
    radio04 = 0;
  }
  if(radio05 > 3600) {
    radio05 = 0;
  }
  if(radio06 > 3600) {
    radio06 = 0;
  }
  if(radio07 > 3600){
    radio07 = 0;
  }
  if(radio08 > 3600){
    radio08 = 0;
  }
  if(radio09 > 3600)
  {
    radio09 = 0;
  }

  // TEXTO PRINCIPAL (pregunta)
  textFont(customFont);
  textAlign(CENTER, TOP);
  textSize(questionSize);
  fill('#e4279e');

  let lineasInfo = obtenerLineasTexto(myQuestion, width);
  lineasGeneradas = lineasInfo.length;
  text(myQuestion, (width / 2) - (width / 2) / 2, questionSize, width/2, height);

  // Posicionar textarea
  miTextarea.position((width / 4) - (width / 4) / 4, (height / 2 - questionSize) - miTextarea.elt.scrollHeight/ questionSize * 15) ;
  miTextarea.size(width * 0.66, inputFontSize * .2);
  miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');

  if (estadoActual === "escribiendo") {
    miTextarea.elt.focus();
  }

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;

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

  // DECIDIR SI USAR CARA O MOUSE
  let posicionX, posicionY;

  if (usarCara && caraDetectada) {
    // ✅ USAR EL CENTRO DE LA CARA DETECTADA
    posicionX = caraX;
    posicionY = caraY;

    // Si hay área de puntos definida, limitar al área
    if (areaPuntos.ancho > 0 && areaPuntos.alto > 0) {
      posicionX = constrain(posicionX, areaPuntos.minX, areaPuntos.maxX);
      posicionY = constrain(posicionY, areaPuntos.minY, areaPuntos.maxY);
    } else {
      // Limitar a los bordes del canvas
      posicionX = constrain(posicionX, 0, width);
      posicionY = constrain(posicionY, 0, height);
    }

    // Debug de coordenadas
    if (frameCount % 60 === 0) {
      //console.log("👁️ Cara mapeada - X:", posicionX.toFixed(0), "Y:", posicionY.toFixed(0));
    }
  } else {
    // ✅ USAR MOUSE (fallback)
    posicionX = mouseX;
    posicionY = mouseY;
  }

  // ✅ LÓGICA MEJORADA: Calcular intensidad basada en posición X e Y
  let intensidadActual = ruidoIntensidad;

  // Definir área del texto
  let textoStartX, textoEndX, textoStartY, textoEndY;

  if (points.length > 0 && areaPuntos.ancho > 0) {
    textoStartX = areaPuntos.minX;
    textoEndX = areaPuntos.maxX;
    textoStartY = areaPuntos.minY;
    textoEndY = areaPuntos.maxY;
  } else {
    textoStartX = width/5;
    textoEndX = width/5 + width * 0.65;
    textoStartY = textAreaAndQuestionSize;
    textoEndY = height * 0.8;
  }

  // Verificar si está sobre el área del texto
  let estaSobreTexto = posicionX > textoStartX && posicionX < textoEndX &&
    posicionY > textoStartY && posicionY < textoEndY;

  if (estaSobreTexto) {
    let centroX = textoStartX + (textoEndX - textoStartX) / 2;
    let centroY = textoStartY + (textoEndY - textoStartY) / 2;

    let distanciaX = abs(posicionX - centroX);
    let distanciaY = abs(posicionY - centroY);

    let maxDistanciaX = (textoEndX - textoStartX) / 2;
    let maxDistanciaY = (textoEndY - textoStartY) / 2;

    let normalX = distanciaX / maxDistanciaX;
    let normalY = distanciaY / maxDistanciaY;

    let distanciaNormal = max(normalX, normalY);
    intensidadActual = map(distanciaNormal, 0, 1, 2, ruidoIntensidad);
  }

  // Mostrar puntos con efecto de ruido
  // Mostrar puntos con efecto de ruido - VERSIÓN OPTIMIZADA
  if (mostrarPuntos && points.length > 0 && puntosBase.length === points.length) {
    if (puntosAlpha < 255) {
      puntosAlpha += 5; // Más rápido
    }

    // ✅ OPTIMIZACIÓN: Pre-calcular valores de ruido una vez por frame
    const tiempo = frameCount * 0.03;
    const ruidoBaseX = sin(tiempo) * intensidadActual;
    const ruidoBaseY = cos(tiempo * 0.8) * intensidadActual;

    // ✅ OPTIMIZACIÓN: Usar buffer de gráficos para puntos estáticos
    if (!puntosBuffer || puntosBufferDirty) {
      renderizarPuntosBuffer();
    }

    // Dibujar el buffer una vez
    image(puntosBuffer, 0, 0);

    // ✅ OPTIMIZACIÓN: Solo calcular dinámicamente para puntos cercanos
    const puntosCercanos = obtenerPuntosCercanos(posicionX, posicionY, 200);

    for (let i = 0; i < puntosCercanos.length; i++) {
      let base = puntosCercanos[i];
      let distancia = dist(posicionX, posicionY, base.x, base.y);

      if (distancia < 180) {
        let factor = pow(map(distancia, 0, 180, 0, 1), 1.5);
        let ruidoX = sin(tiempo + base.offsetX) * intensidadActual * factor;
        let ruidoY = cos(tiempo * 0.8 + base.offsetY) * intensidadActual * factor;

        fill(255, 255, 0, puntosAlpha);
        noStroke();
        ellipse(base.x + ruidoX, base.y + ruidoY, dotSize, dotSize);
      }
    }
  }
  // Mostrar estado actual
  fill(255);
  textSize(16);
  textAlign(LEFT);
  let estadoCara = usarCara ? (caraDetectada ? "Cara ✅" : "Buscando rostro...") : "Mouse";
  text(`Estado: ${estadoActual} | Control: ${estadoCara}`, 20, height - 30);

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
    line(centroX, textoStartY, centroX, textoEndY);
    line(textoStartX, centroY, textoEndX, centroY);

    // Punto central
    fill(0, 255, 0, 80);
    noStroke();
    ellipse(centroX, centroY, 8, 8);

    // Posición actual (cara o mouse)
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

  // Mostrar indicador de posición (debug original)
  if (estaSobreTexto && (usarCara || mouseIsPressed)) {
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

  miTextarea.attribute('placeholder', '');

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

  // ✅ USAR LA POSICIÓN REAL DEL TEXTAREA
  let textareaPosX = (width / 4) - (width / 4) / 4;
  let textareaPosY = (height / 2 - questionSize) - miTextarea.elt.scrollHeight / questionSize * 15;

  for (let i = 0; i < lineas.length; i++) {
    let posY = textareaPosY + (i * tamanoFuente * 1.2);

    // ✅ CALCULAR CENTRADO DE CADA LÍNEA (igual que el textarea)
    let anchoLinea = textWidth(lineas[i]);
    let posX = textareaPosX + (width * 0.66 - anchoLinea) / 2;

    for (let j = 0; j < lineas[i].length; j++) {
      let char = lineas[i].charAt(j);
      if (char !== ' ') {
        textSize(tamanoFuente);
        textFont(customFont);

        // ✅ POSICIÓN EXACTA DE CADA LETRA CENTRADA
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

// FUNCIÓN SIMPLIFICADA: Todo en una sola función
async function generarTextosConIA() {
  let textoOriginal = savedText;

  try {
    console.log("🔄 Generando 13 textos...");

    let todosLosTextos = [];
    const todosLosTipos = [
      'polarizar_negativo',
      'distorsion_publicitaria',
      'exagerar',
      'polarizar_positivo',
      'exagerar',
      'polarizar_negativo',
      'polarizar_negativo',
      'polarizar_positivo',
      'distorsion_publicitaria',
      'exagerar',           // Mensaje adicional 1
      'polarizar_negativo', // Mensaje adicional 2
      'distorsion_publicitaria', // Mensaje adicional 3
      'polarizar_positivo'  // Mensaje adicional 4
    ];

    // Generar TODOS los textos en una sola pasada
    for (let i = 0; i < 13; i++) {
      let textoGenerado = await distorsionadorTexto.distorsionarTexto(textoOriginal, todosLosTipos[i]);
      todosLosTextos.push(textoGenerado);
      console.log(`✅ Texto ${i+1} generado:`, textoGenerado);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Combinar todos los textos con el original intercalado
    let textoCombinado =
      todosLosTextos[0] + " " + textoOriginal + " " +
      todosLosTextos[1] + " " + todosLosTextos[3] + " " +
      todosLosTextos[2] + " " + todosLosTextos[4] + " " +
      todosLosTextos[5] + " " + todosLosTextos[6] + " " +
      todosLosTextos[7] + " " + todosLosTextos[8] + " " +
      todosLosTextos[9] + " " + todosLosTextos[10] + " " +
      todosLosTextos[11] + " " + todosLosTextos[12];

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

  // Primero generar todos los puntos
  for (let i = 0; i < lineas.length; i++) {
    let posY = textAreaAndQuestionSize + (i * tamanoFuente * 1.2);
    let posX = width/5;

    let puntosOutline = customFont.textToPoints(lineas[i], posX, posY, tamanoFuente, {
      sampleFactor: 0.22,
      simplifyThreshold: 0
    });

    for (let punto of puntosOutline) {
      points.push(punto);
    }
  }

  // ✅ CALCULAR EL CENTRO DE MASA DE TODOS LOS PUNTOS
  let sumaX = 0;
  let sumaY = 0;

  for (let punto of points) {
    sumaX += punto.x;
    sumaY += punto.y;
  }

  let centroX = sumaX / points.length;
  let centroY = sumaY / points.length;

  // ✅ CALCULAR DESPLAZAMIENTO NECESARIO PARA CENTRAR EN PANTALLA
  let desplazamientoX = width / 2 - centroX;
  let desplazamientoY = height / 2 - centroY;

  // ✅ LIMPIAR Y VOLVER A GENERAR CON EL DESPLAZAMIENTO APLICADO
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
      // ✅ APLICAR DESPLAZAMIENTO PARA CENTRAR
      let puntoCentrado = {
        x: punto.x + desplazamientoX,
        y: punto.y + desplazamientoY + 100
      };

      points.push(puntoCentrado);
      puntosBase.push({
        x: puntoCentrado.x,
        y: puntoCentrado.y,
        offsetX: random(0, 1000),
        offsetY: random(0, 1000)
      });
    }
  }

  // ✅ CALCULAR EL ÁREA QUE OCUPAN LOS PUNTOS
  calcularAreaPuntos();

  console.log("⭕ Puntos centrados generados:", points.length, "puntos");
  console.log("🎯 Área de puntos:",
    "X:", areaPuntos.minX.toFixed(0), "-", areaPuntos.maxX.toFixed(0),
    "Y:", areaPuntos.minY.toFixed(0), "-", areaPuntos.maxY.toFixed(0));
  console.log("🎯 Nuevo centro:", width/2, height/2);
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
    // Cambiar entre cara y mouse
    usarCara = !usarCara;
    console.log(usarCara ? "🔄 Usando detección de cara" : "🖱️ Usando mouse");
    return false;
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

function calcularAreaPuntos() {
  if (points.length === 0) return;

  // Inicializar con el primer punto
  areaPuntos.minX = points[0].x;
  areaPuntos.maxX = points[0].x;
  areaPuntos.minY = points[0].y;
  areaPuntos.maxY = points[0].y;

  // Encontrar los límites
  for (let punto of points) {
    areaPuntos.minX = min(areaPuntos.minX, punto.x);
    areaPuntos.maxX = max(areaPuntos.maxX, punto.x);
    areaPuntos.minY = min(areaPuntos.minY, punto.y);
    areaPuntos.maxY = max(areaPuntos.maxY, punto.y);
  }

  // Calcular dimensiones
  areaPuntos.ancho = areaPuntos.maxX - areaPuntos.minX;
  areaPuntos.alto = areaPuntos.maxY - areaPuntos.minY;

  // Agregar un margen alrededor de los puntos
  let margen = 50;
  areaPuntos.minX -= margen;
  areaPuntos.maxX += margen;
  areaPuntos.minY -= margen;
  areaPuntos.maxY += margen;
  areaPuntos.ancho = areaPuntos.maxX - areaPuntos.minX;
  areaPuntos.alto = areaPuntos.maxY - areaPuntos.minY;
}

function renderizarPuntosBuffer() {
  puntosBuffer = createGraphics(width, height);
  puntosBuffer.fill(255, 255, 0, puntosAlpha);
  puntosBuffer.noStroke();

  for (let i = 0; i < points.length; i++) {
    puntosBuffer.ellipse(points[i].x, points[i].y, dotSize, dotSize);
  }

  puntosBufferDirty = false;
}

function obtenerPuntosCercanos(x, y, radio) {
  const cercanos = [];
  for (let i = 0; i < puntosBase.length; i++) {
    if (dist(x, y, puntosBase[i].x, puntosBase[i].y) < radio) {
      cercanos.push(puntosBase[i]);
    }
  }
  return cercanos;
}