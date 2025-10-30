let particulas = [];
let titulo = "ECOS";
let botonComenzar;
let efectoActivo = false;
let customFont;

let radio01 = 0;
let radio02 = 400;
let radio03 = 800;
let radio04 = 1200;
let radio05 = 1600;
let radio06 = 2000;
let radio07 = 2400;
let radio08 = 2800;
let radio09 = 3200;


function preload() {
  customFont = loadFont('assets/fonts/Montserrat-Black.ttf');
}


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('portada-container');

  // Crear botón de comenzar
  botonComenzar = createButton('Comenzar');
  botonComenzar.position(width/2 - 100, height/2 + 200);
  botonComenzar.size(200, 200);
  botonComenzar.style('font-size', '20px');
  botonComenzar.style('font-weight', 'bold');
  botonComenzar.style('background-color', '#ff3cb4');
  botonComenzar.style('color', '#000');
  botonComenzar.style('border', 'none');
  botonComenzar.style('border-radius', '100px');
  botonComenzar.style('cursor', 'pointer');
  botonComenzar.style('transition', 'all 0.3s');
  botonComenzar.style('z-index', '1000');

  // Efecto hover del botón
  botonComenzar.mouseOver(() => {
    botonComenzar.style('background-color', '#fb2faf');
    botonComenzar.style('transform', 'scale(1.05)');
  });

  botonComenzar.mouseOut(() => {
    botonComenzar.style('background-color', '#ff3cb4');
    botonComenzar.style('transform', 'scale(1)');
  });

  // Al hacer clic, ir a la página de interacción
  botonComenzar.mousePressed(() => {
    // Efecto de transición
    efectoActivo = true;
    setTimeout(() => {
      window.location.href = 'interaccion.html';
    }, 800);
  });
}

function draw() {
  // Fondo con efecto de partículas
  background(0);

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


  // Efecto de desvanecimiento al hacer clic
  if (efectoActivo) {
    fill(0, 200);
    rect(0, 0, width, height);
  }

  // Título stroke
  textAlign(CENTER, CENTER);
  textSize( map((abs(sin(frameCount * 0.01) * 450 )), 0, 450, 380, 450)); // Tamaño responsive
  noFill();
  textFont(customFont);
  stroke('rgba(50,229,107,0.66)');
  textStyle(BOLD);
  text(titulo, width/2, height/2 - 80);

  // Título Abajo
  textAlign(CENTER, CENTER);
  textSize( map((abs(cos(frameCount * 0.01) * 250 )), 0, 250, 200, 250)); // Tamaño responsive
  fill( 'rgba(238,89,243,0.39)');
  noStroke();
  textFont(customFont);
  textStyle(BOLD);
  text(titulo, width/2, height/2 - 80);


  push();
  let tamañoTexto = 500;
  textSize(tamañoTexto);
  textFont(customFont);
  textStyle(BOLD);

// Calcular el ancho total del texto para centrado
  let anchoTotal = textWidth(titulo);
  let xInicial = width/2 - anchoTotal/2;
  let yBase = height/2 - 80;

// Procesar cada letra individualmente
  for (let i = 0; i < titulo.length; i++) {
    let letra = titulo.charAt(i);

    // Calcular posición X de esta letra
    let anchoHastaAhora = textWidth(titulo.substring(0, i));
    let xLetra = xInicial + anchoHastaAhora;
    let anchoLetra = textWidth(letra);
    let centroXLetra = xLetra + anchoLetra/2;

    // Obtener puntos solo para esta letra
    let puntosLetra = customFont.textToPoints(letra, xLetra, yBase, tamañoTexto, {
      sampleFactor: 0.1 // Ajustar según necesidad
    });

    // Onda de audio para esta letra
    stroke(255, 255, 0, 180);
    strokeWeight(4);
    noFill();

    beginShape();
    for (let j = 0; j < puntosLetra.length; j++) {
      let punto = puntosLetra[j];

      stroke(255, 255, 0, 100);
      // Usar la posición en la palabra completa para onda coherente
      let posicionGlobal = anchoHastaAhora + (punto.x - xLetra);

      // Múltiples frecuencias que respetan la posición global
      let onda1 = sin(posicionGlobal * 10 + frameCount * 0.8) * 15;
      let onda2 = cos(posicionGlobal * 2 + frameCount * 0.6) * 10;
      let onda3 = sin(posicionGlobal * 2 + frameCount * 0.4) * 8;
      let offsetTotal = (onda1 + onda2 + onda3) / 3;

      // Dirección radial desde el centro de la letra
      let angulo = atan2(punto.y - yBase, punto.x - centroXLetra);

      vertex(
        punto.x + cos(angulo) * offsetTotal,
        punto.y + sin(angulo) * offsetTotal + 200
      );
    }
    endShape(CLOSE);
  }
  pop();

  // Título principal
  textAlign(CENTER, CENTER);
  textSize( 350 ); // Tamaño responsive
  fill( '#e1e1e1');
  textFont(customFont);
  textStyle(BOLD);
  text(titulo, width/2, height/2 - 80);

}

// Función para hacer el texto responsive
function clamp(min, valor, max) {
  return Math.max(min, Math.min(valor, max));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reposicionar botón al redimensionar
  botonComenzar.position(width/2 - 150, height/2 + 100);
}

// Efecto de partículas al mover el mouse
function mouseMoved() {

}