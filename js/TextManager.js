// TextManager.js
class TextManager {
  constructor() {
    this.textos = [];
  }

  crearTextoDinamico(texto, x, y, anchoMaximo, tamanoBase = 24) {
    let textoObj = {
      contenido: texto,
      x: x,
      y: y,
      anchoMaximo: anchoMaximo,
      tamanoBase: tamanoBase,
      color: color,

      mostrar: function() {
        let tamanoFuente = max(16, this.tamanoBase * (windowWidth / 800));
        textSize(tamanoFuente);
        fill(this.color[0], this.color[1], this.color[2]);
        textAlign(CENTER, TOP);

        let lineas = this.obtenerLineas(tamanoFuente);
        let espaciado = tamanoFuente * 1.3;

        for (let i = 0; i < lineas.length; i++) {
          text(lineas[i], this.x, this.y + (i * espaciado));
        }

        return lineas.length;
      },

      obtenerLineas: function(tamanoFuente) {
        textSize(tamanoFuente);
        let palabras = this.contenido.split(' ');
        let lineas = [];
        let lineaActual = "";

        for (let i = 0; i < palabras.length; i++) {
          let testLinea = lineaActual + palabras[i] + " ";
          let ancho = textWidth(testLinea);

          if (ancho > this.anchoMaximo && lineaActual !== "") {
            lineas.push(lineaActual.trim());
            lineaActual = palabras[i] + " ";
          } else {
            lineaActual = testLinea;
          }
        }

        if (lineaActual !== "") {
          lineas.push(lineaActual.trim());
        }

        return lineas;
      },

      actualizarTexto: function(nuevoTexto) {
        this.contenido = nuevoTexto;
      },

      setColor: function(r, g, b) {
        this.color = [r, g, b];
      }
    };

    this.textos.push(textoObj);
    return textoObj;
  }
}