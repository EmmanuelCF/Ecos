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

// Variables para el debounce híbrido
let timeoutInput;
let lastProcessedText = "";

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
    miTextarea.style('color', 'rgba(0,0,0,0)');
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

    // Dibujar puntos
    for(let i = 0; i < points.length; i++){
        let limite = points.length * 0.8;
        let x = points[i].x;
        let y = points[i].y;

        if(i < limite) {
            let intensidad = map(i, 0, limite, 20, 5);
            let sinValue = sin(frameCount + i * 0.1) * intensidad;
            points[i].y += sinValue;
        }

        let dotSize = 5;
        fill(255, 255, 0);
        noStroke();
        ellipse(x, y, dotSize);
    }
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
            sampleFactor: 0.2, // Menos densidad para mayor velocidad
            simplifyThreshold: 0
        });

        points = points.concat(puntosOutline);
        // NO puntos interiores por ahora (más rápidos)
    }
    console.log("Regeneración RÁPIDA (solo outline):", points.length, "puntos");
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
            sampleFactor: 0.2,
            simplifyThreshold: 0
        });

        points = points.concat(puntosOutline);
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