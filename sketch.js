let miTextarea;
let myQuestion = "¿Qué te gustaría que alguien por fin entendiera?";
let questionSize = 60;
let lineasGeneradas = 0;
let inputFontSize = 40;
let textosDistorsionados = [];
let savedText = "";
let textAreaAndQuestionSize = 0;
let tamanoFuente = 40;
let savedTextStartTime = 0;

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
let botonEnviar;
let fadingLetters = [];

let mostrarTextos = false;
let textosAlpha = 0;
let estadoActual = "escribiendo";

let radio01 = 0;
let radio02 = 400;
let radio03 = 800;
let radio04 = 1200;
let radio05 = 1600;
let radio06 = 2000;
let radio07 = 2400;
let radio08 = 2800;
let radio09 = 3200;

let tiempo = 0;
let glitchIntensidad = 0;
let chromaticAberration = 0;

// VARIABLES PARA SAVED TEXT
let mostrarSavedText = false;
let savedTextAlpha = 0;
let savedTextTimer = 0;
let savedTextDelay = 180; // 3 segundos a 60fps
let savedTextCycleCount = 0;
let savedTextState = "apareciendo"; // "apareciendo", "visible", "desapareciendo"

function setup() {
  createCanvas(windowWidth, windowHeight);

  calibracion.minX = width * 0.1;
  calibracion.maxX = width * 0.9;
  calibracion.minY = height * 0.2;
  calibracion.maxY = height * 0.8;
  calibracion.calibrado = true;

  // Inicializar el modelo de IA de texto
  distorsionadorTexto.inicializar().then(exito => {
    // Modelo cargado
  });

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

function preload() {
  customFont = loadFont('assets/fonts/Montserrat-Regular.ttf');
}

function draw() {
  background('#000000');
  tiempo += 0.005;

  actualizarEfectos();
  dibujarElementosFondo();

  // TEXTO PRINCIPAL (pregunta)
  textFont(customFont);
  textAlign(CENTER, TOP);
  textSize(questionSize);
  fill('#e4279e');

  let lineasInfo = obtenerLineasTexto(myQuestion, width);
  lineasGeneradas = lineasInfo.length;
  text(myQuestion, (width / 2) - (width / 2) / 2, questionSize, width/2, height);

  // Solo mostrar y posicionar textarea si estamos escribiendo
  if (estadoActual === "escribiendo") {
    miTextarea.position((width / 4) - (width / 4) / 4, (height / 2 - questionSize) - miTextarea.elt.scrollHeight/ questionSize * 15);
    miTextarea.size(width * 0.66, inputFontSize * .2);
    miTextarea.style('height', miTextarea.elt.scrollHeight + 'px');
    miTextarea.elt.focus();
  } else {
    // Ocultar textarea completamente
    miTextarea.position(-1000, -1000);
  }

  textAreaAndQuestionSize = questionSize * lineasGeneradas + questionSize;

  // Mostrar letras que se desvanecen (solo desvanecimiento, sin flotar)
  mostrarLetrasDesvanecientes();

  // === IMPORTANTE: Mostrar saved text ENCIMA de todo ===
  mostrarLetrasDesvanecientes();

  // === SAVED TEXT - siempre mostrar si está activo ===
  if (mostrarSavedText) {
    mostrarTextoGuardado();
  }

  // Mostrar textos distorsionados
  if (mostrarTextos && textosDistorsionados.length > 0) {
    if (textosAlpha < 255) {
      textosAlpha += 3;
    }
    dibujarTextosDistorsionados(mouseX, mouseY);
  }

  // DEBUG: Mostrar estado actual
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text(`Estado: ${estadoActual}`, 20, height - 60);
  text(`Saved Text: ${mostrarSavedText ? 'VISIBLE' : 'oculto'} alpha: ${savedTextAlpha}`, 20, height - 40);
  text(`Textos Dist: ${textosDistorsionados.filter(t => t.activo).length}/${textosDistorsionados.length}`, 20, height - 20);
}
function mostrarTextoGuardado() {
  // Inicializar el tiempo de inicio si es la primera vez
  if (savedTextStartTime === 0) {
    savedTextStartTime = millis();
    console.log("⏰ Saved text iniciado en:", savedTextStartTime);
  }

  let tiempoTranscurrido = millis() - savedTextStartTime;

  switch(savedTextState) {
    case "apareciendo":
      // Aparición en 0.2 segundos (200ms) - 12 frames a 60fps
      let progressAparecer = constrain(tiempoTranscurrido / 200, 0, 1);
      let easedAparecer = 1 - Math.pow(2, -10 * progressAparecer);
      savedTextAlpha = easedAparecer * 255;

      if (progressAparecer >= 1) {
        savedTextAlpha = 255;
        savedTextState = "visible";
        savedTextStartTime = millis(); // Reiniciar tiempo para la siguiente fase
        console.log("✅ Saved text completamente visible");
      }
      break;

    case "visible":
      // Mantener visible por 2-3 segundos
      if (millis() - savedTextStartTime >= 2000) { // 2 segundos visible
        savedTextState = "desapareciendo";
        savedTextStartTime = millis(); // Reiniciar tiempo para desaparición
        console.log("🔄 Saved text comenzando a desaparecer");
      }
      break;

    case "desapareciendo":
      // Desaparición en 0.2 segundos (200ms) - 12 frames
      let progressDesaparecer = constrain((millis() - savedTextStartTime) / 200, 0, 1);
      let easedDesaparecer = progressDesaparecer * progressDesaparecer * progressDesaparecer;
      savedTextAlpha = 255 - (easedDesaparecer * 255);

      if (progressDesaparecer >= 1) {
        savedTextAlpha = 0;
        savedTextState = "esperando"; // Nuevo estado: espera antes de reaparecer
        savedTextStartTime = millis(); // Reiniciar tiempo para espera
        console.log("✅ Saved text desaparecido - esperando para reaparecer");
      }
      break;

    case "esperando":
      // Esperar tiempo que aumenta con cada ciclo (2-3 segundos base + incremento)
      let tiempoEspera = 2000 + (savedTextCycleCount * 1000); // 2 segundos base + 1 segundo extra por ciclo
      if (millis() - savedTextStartTime >= tiempoEspera) {
        savedTextState = "apareciendo";
        savedTextStartTime = millis(); // Reiniciar tiempo para aparición
        savedTextCycleCount++; // Incrementar contador de ciclos
        console.log("🔄 Saved text reapareciendo - ciclo:", savedTextCycleCount, "espera:", tiempoEspera, "ms");
      }
      break;
  }

  // DIBUJAR EL TEXTO
  if (savedTextAlpha > 0) {
    push();

    textFont(customFont);
    textAlign(CENTER, CENTER);
    textSize(tamanoFuente);

    // Texto simple y visible
    noStroke();
    fill(255, 177, 88, savedTextAlpha);

    let lineas = dividirEnLineas(savedText, width * 0.8, tamanoFuente);
    for (let i = 0; i < lineas.length; i++) {
      text(lineas[i], width/2, height/2 + (i - lineas.length/2) * tamanoFuente * 1.2);
    }

    pop();
  }
}

function actualizarEfectos() {
  let velocidad = dist(pmouseX, pmouseY, mouseX, mouseY);
  glitchIntensidad = lerp(glitchIntensidad, min(velocidad * 0.8, 30), 0.1);
  chromaticAberration = lerp(chromaticAberration, glitchIntensidad * 0.5, 0.1);
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
  console.log("🎨 dibujarTextosDistorsionados llamado - textosAlpha:", textosAlpha, "total textos:", textosDistorsionados.length);

  let textosActivos = textosDistorsionados.filter(t => t.activo);
  console.log("📊 Textos activos:", textosActivos.length);

  for (let i = 0; i < textosDistorsionados.length; i++) {
    let textoObj = textosDistorsionados[i];

    // Solo mostrar textos que han sido activados
    if (!textoObj.activo) {
      console.log("❌ Texto", i, "INACTIVO - saltando");
      continue;
    }

    console.log("✅ Dibujando texto activo", i, ":", textoObj.texto.substring(0, 30) + "...");

    let distancia = dist(posX, posY, textoObj.x, textoObj.y);
    let influencia = map(distancia, 0, 400, 1.5, 0, true);

    aplicarEfectosTexto(textoObj, influencia, i);
  }
}


function aplicarEfectosTexto(textoObj, influencia, index) {
  console.log("   🖌️ aplicarEfectosTexto para texto", index, "en pos:", textoObj.x, textoObj.y);

  push();

  textFont(customFont);
  textAlign(textoObj.align, textoObj.baseline);

  let centroX = width/2 + (textoObj.x - width/2) * 0.8;
  let centroY = height/2 + (textoObj.y - height/2) * 0.8;

  let offsetX = sin(tiempo * textoObj.velocidad * 1.5 + index * 0.7) * textoObj.amplitud * 2;
  let offsetY = cos(tiempo * textoObj.velocidad * 1.2 + index * 0.9) * textoObj.amplitud * 1.8;

  let xFinal = centroX + offsetX;
  let yFinal = centroY + offsetY;

  let rotacionDinamica = sin(tiempo * textoObj.velocidad * 2 + index) * textoObj.rotacionMaxima;
  let rotacionTotal = textoObj.rotacion + rotacionDinamica;

  console.log("   📍 Posición final:", xFinal, yFinal, "rotación:", rotacionTotal);

  translate(xFinal, yFinal);
  //rotate(rotacionTotal);

  aplicarEfectoLetrasFlotantes(textoObj, 0, 0, influencia);

  pop();

  console.log("   ✅ Efectos aplicados para texto", index);
}

function aplicarEfectoLetrasFlotantes(textoObj, x, y, influencia) {
  console.log("     🔤 aplicarEfectoLetrasFlotantes - texto:", textoObj.texto.substring(0, 20) + "...");

  let alpha = textosAlpha * textoObj.opacidad;
  let tamano = textoObj.tamano;
  let chars = textoObj.texto.split('');

  textSize(tamano);

  let anchoTotal = textWidth(textoObj.texto);
  console.log("     📏 Ancho total:", anchoTotal, "tamaño:", tamano, "alpha:", alpha);

  for (let i = 0; i < chars.length; i++) {
    let char = chars[i];
    if (char === ' ') continue;

    let baseX = x - anchoTotal/2 + textWidth(textoObj.texto.substring(0, i));
    let baseY = y;

    let floatOffsetX = sin(tiempo * 3 + i * 0.5) * 20 * influencia;
    let floatOffsetY = cos(tiempo * 2.5 + i * 0.7) * 15 * influencia;

    let charRotation = sin(tiempo * 4 + i) * 0.5;

    push();
    translate(baseX + floatOffsetX, baseY + floatOffsetY);
    rotate(charRotation);

    if (random() > 0.5) {
      fill(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha * 0.9);
      noStroke();
    } else {
      noFill();
      stroke(textoObj.color.levels[0], textoObj.color.levels[1], textoObj.color.levels[2], alpha);
      strokeWeight(2);
    }

    textSize(tamano * (0.8 + sin(tiempo + i) * 0.3));
    text(char, 0, 0);
    pop();
  }

  console.log("     ✅ Letras dibujadas");
}

function inputToTextFast() {
  let anchoMaximo = width * 0.65;
  let lineas = dividirEnLineas(savedText, anchoMaximo, tamanoFuente);
}

async function iniciarProcesoCompleto() {
  console.log("🚀 iniciarProcesoCompleto() llamado");
  console.log("📝 savedText:", savedText);

  if (generando) {
    console.log("❌ Ya está generando, retornando");
    return;
  }
  generando = true;

  estadoActual = "desvaneciendo";
  console.log("🔄 Estado: desvaneciendo");

  // Ocultar textarea y botón inmediatamente
  miTextarea.position(-1000, -1000);
  botonEnviar.hide();

  createFadingLetters(miTextarea.value());
  console.log("📜 Letras desvanecientes creadas");

  await esperarDesvanecimiento();
  console.log("✅ Desvanecimiento completado");

  // INICIAR EL CICLO DE PULSO DEL SAVED TEXT
  mostrarSavedText = true;
  savedTextAlpha = 0;
  savedTextCycleCount = 0; // Resetear contador de ciclos
  savedTextState = "apareciendo"; // Comenzar con aparición
  savedTextStartTime = millis(); // Iniciar tiempo
  console.log("💾 Saved text iniciando ciclo de pulso");

  // NO esperar a que termine el saved text - dejar que pulse indefinidamente
  // mientras tanto, continuar con el proceso en segundo plano

  estadoActual = "procesando";
  console.log("🔄 Estado: procesando - generando textos con IA");
  await generarTextosConIA();
  console.log("✅ Textos con IA generados");

  estadoActual = "mostrandoTextos";
  mostrarTextos = true;
  textosAlpha = 0;

  console.log("🎨 Estado: mostrandoTextos - mostrarTextos:", mostrarTextos);
  console.log("📊 textosDistorsionados length:", textosDistorsionados.length);

  // Activar solo el primer texto inicialmente
  if (textosDistorsionados.length > 0) {
    textosDistorsionados[0].activo = true;
    console.log("✅ Primer texto activado");
  } else {
    console.log("❌ No hay textos para activar");
  }

  generando = false;
  console.log("🏁 Proceso completo terminado - saved text sigue pulsando");
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
          fadeSpeed: random(3, 6), // Más rápido para desaparecer pronto
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
  console.log("🤖 generarTextosConIA() llamado");
  let textoOriginal = savedText;
  console.log("📄 Texto original:", textoOriginal);

  try {
    let todosLosTextos = [];
    const todosLosTipos = [
      'polarizar_negativo', 'distorsion_publicitaria', 'exagerar',
      'polarizar_positivo', 'exagerar', 'polarizar_negativo',
      'polarizar_negativo', 'polarizar_positivo', 'distorsion_publicitaria',
      'exagerar', 'polarizar_negativo', 'distorsion_publicitaria', 'polarizar_positivo'
    ];

    for (let i = 0; i < 13; i++) {
      console.log("🔄 Generando texto", i + 1, "de 13");
      let textoGenerado = await distorsionadorTexto.distorsionarTexto(textoOriginal, todosLosTipos[i]);
      console.log("📝 Texto generado", i + 1, ":", textoGenerado.substring(0, 50) + "...");
      todosLosTextos.push(textoGenerado);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    let textoCombinado = todosLosTextos.join(" ") + " " + textoOriginal;
    console.log("🎯 Llamando generarTextosVisuales con", todosLosTextos.length, "textos");
    generarTextosVisuales(textoCombinado, todosLosTextos);

  } catch (error) {
    console.error("❌ Error en generarTextosConIA:", error);
    console.log("🔄 Usando texto original como fallback");
    generarTextosVisuales(savedText, [savedText]);
  }
}


function generarTextosVisuales(textoCompleto, textosIndividuales) {
  console.log("🎨 generarTextosVisuales() llamado");
  console.log("📊 textosIndividuales recibidos:", textosIndividuales.length);

  textosDistorsionados = [];

  // Área MÁS VISIBLE - usar casi toda la pantalla
  areaTexto.minX = width * 0.1;
  areaTexto.maxX = width * 0.9;
  areaTexto.minY = height * 0.2;
  areaTexto.maxY = height * 0.8;
  areaTexto.ancho = areaTexto.maxX - areaTexto.minX;
  areaTexto.alto = areaTexto.maxY - areaTexto.minY;

  let colores = [
    color(255, 50, 50),    // Rojo brillante
    color(50, 255, 50),    // Verde brillante
    color(50, 50, 255),    // Azul brillante
    color(255, 255, 50),   // Amarillo
    color(255, 50, 255),   // Magenta
    color(50, 255, 255),   // Cian
    color(255, 150, 50),   // Naranja
    color(150, 50, 255)    // Púrpura
  ];

  for (let i = 0; i < textosIndividuales.length; i++) {
    let texto = textosIndividuales[i];
    if (texto.length < 3) continue;

    // POSICIONES MÁS CENTRALES Y VISIBLES
    let textoObj = {
      texto: texto,
      x: width/2 + random(-200, 200),  // Centrado con variación
      y: height/2 + random(-150, 150), // Centrado con variación
      tamano: random(25, 40),          // Tamaño más visible
      color: random(colores),
      opacidad: random(0.8, 1.0),      // Más opaco
      velocidad: random(0.5, 1.2),     // Más movimiento
      amplitud: random(20, 40),        // Más amplitud
      align: 'CENTER',
      baseline: 'CENTER',
      rotacion: random(-0.3, 0.3),
      rotacionMaxima: random(0.5, 1.0),
      activo: false
    };

    textosDistorsionados.push(textoObj);
  }

  // DEBUG: Activar el primer texto automáticamente para prueba
  if (textosDistorsionados.length > 0) {
    textosDistorsionados[0].activo = true;
  }
  console.log("✅ textosDistorsionados creados:", textosDistorsionados.length);
}


function mousePressed() {
  if (mouseButton === LEFT) {
    console.log("🖱️ CLICK detectado - mostrarTextos:", mostrarTextos, "textosDistorsionados:", textosDistorsionados.length);

    // Activar el siguiente texto distorsionado con cada click
    if (mostrarTextos && textosDistorsionados.length > 0) {
      let siguienteInactivo = textosDistorsionados.findIndex(t => !t.activo);
      console.log("🔍 Buscando siguiente inactivo:", siguienteInactivo);

      if (siguienteInactivo !== -1) {
        textosDistorsionados[siguienteInactivo].activo = true;
        console.log("✅ Texto", siguienteInactivo, "activado:", textosDistorsionados[siguienteInactivo].texto.substring(0, 30) + "...");
      } else {
        console.log("✅ Todos los textos están activos");
      }
    } else {
      console.log("❌ No se pueden activar textos - condiciones no cumplidas");
    }
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
  mostrarSavedText = false;
  savedTextAlpha = 0;
  savedTextCycleCount = 0;
  savedTextDelay = 180;
  miTextarea.value('');

  // Mostrar textarea y botón nuevamente
  miTextarea.position((width / 4) - (width / 4) / 4, (height / 2 - questionSize) - miTextarea.elt.scrollHeight/ questionSize * 15);
  miTextarea.elt.focus();

  botonEnviar.show();
  botonEnviar.style('opacity', '1');
}

// Funciones auxiliares
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