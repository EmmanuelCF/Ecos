class TextoDistorsionador {
  constructor() {
    this.modeloCargado = true;
    this.cargando = false;
    this.inicializarBancosCompletos();
  }

  async inicializar() {
    console.log("✅ Sistema de reglas cargado");
    return true;
  }

  inicializarBancosCompletos() {
    // BANCOS COMPLETOS para todos los placeholders
    this.adjetivos = {
      positivo: ["maravilloso", "increíble", "fantástico", "extraordinario", "excepcional", "perfecto", "ideal", "sublime"],
      negativo: ["terrible", "horrible", "espantoso", "pésimo", "deplorable", "desastroso", "indignante", "insoportable"],
      extremo: ["alucinante", "electrizante", "apabullante", "devastador", "catastrófico", "espectacular", "inolvidable"],
      superlativo: ["único", "inimaginable", "increíble", "extraordinario", "excepcional", "colosal", "monumental"]
    };

    this.acciones = {
      positiva: ["brilla con luz propia", "ilumina el camino", "transforma vidas", "supera expectativas", "cambia paradigmas"],
      negativa: ["arruina todo", "destroza ilusiones", "frustra esperanzas", "complica la existencia", "empaña la realidad"],
      intensa: ["conmueve hasta las lágrimas", "impacta profundamente", "remueve por dentro", "deja sin aliento", "marca un antes y un después"],
      dramatica: ["desgarra el alma", "conmociona hasta lo más profundo", "traspasa fronteras", "redefine conceptos"]
    };

    this.verbosIntensos = {
      positivo: ["fascina", "apasiona", "entusiasma", "emociona", "deslumbra", "enamora"],
      negativo: ["indigna", "desespera", "agobia", "atormenta", "frustra", "decepciona"]
    };

    this.contextos = {
      negativo: ["en pleno siglo XXI", "con lo avanzada que está la sociedad", "en estas circunstancias", "en este mundo moderno"],
      positivo: ["en medio de tanta belleza", "con tanta armonía alrededor", "en este contexto ideal", "en un mundo tan perfecto"],
      dramatico: ["en los momentos más cruciales", "cuando menos te lo esperas", "ante la mirada de todos", "en la quietud de la noche"]
    };

    this.caracteristicas = {
      positiva: ["transmite paz interior", "eleva el espíritu", "inspira grandeza", "genera bienestar", "proporciona alegría"],
      unica: ["nunca antes vista", "revolucionaria en su enfoque", "innovadora en concepto", "pionera en su género"]
    };

    this.patronesDistorsion = {
      polarizar_negativo: [
        "Realmente [verbo-intenso-negativo] cómo [sustantivo] [accion-negativa]",
        "No soporto que [sustantivo] sea tan [adjetivo-negativo]",
        "[exclamacion-negativa] [sustantivo] es completamente [adjetivo-superlativo-negativo]",
        "Es indignante que [sustantivo] [accion-negativa] de esta manera",
        "Me resulta insufrible el [sustantivo] cuando [contexto-negativo]"
      ],

      polarizar_positivo: [
        "[exclamacion-positiva] [sustantivo] es absolutamente [adjetivo-superlativo-positivo]",
        "Me [verbo-intenso-positivo] cuando [sustantivo] [accion-positiva]",
        "Es maravilloso cómo [sustantivo] logra [accion-positiva]",
        "Realmente [verbo-intenso-positivo] el [sustantivo] que [caracteristica-positiva]",
        "[exclamacion-positiva] no hay nada mejor que [sustantivo] [accion-positiva]"
      ],

      distorsion_publicitaria: [
        "¡ATENCIÓN! Descubre el secreto de [sustantivo] que [beneficio]",
        "¡OFERTA EXCLUSIVA! [sustantivo] que [beneficio-exagerado]",
        "¿Cansado de [problema]? [sustantivo] es la solución definitiva para [beneficio]",
        "¡NO TE PIERDAS! [sustantivo] revolucionario que [caracteristica-unica]",
        "¡INCREÍBLE! [sustantivo] ahora con [mejora] que te [beneficio-emocional]"
      ],

      exagerar: [
        "Es absolutamente [adjetivo-extremo] cómo [sustantivo] [accion-dramatica]",
        "No puedo creer lo [adjetivo-intenso] que es [sustantivo] cuando [contexto-dramatico]",
        "Es algo [adjetivo-hiperbolico] ver cómo [sustantivo] [accion-extrema]",
        "Me impacta profundamente que [sustantivo] sea tan [adjetivo-superlativo]",
        "Es una experiencia [adjetivo-extremo] cuando [sustantivo] [accion-intensa]"
      ]
    };

    this.exclamaciones = {
      positiva: ["¡Increíble!", "¡Asombroso!", "¡Fantástico!", "¡Maravilloso!", "¡Impresionante!"],
      negativa: ["¡Horrible!", "¡Terrible!", "¡Qué desastre!", "¡No puede ser!", "¡Qué indignante!"]
    };

    this.beneficios = [
      "cambiará tu vida", "te hará más feliz", "solucionará todos tus problemas",
      "te dará resultados inmediatos", "es la revolución que esperabas",
      "te sorprenderá gratamente", "superará todas tus expectativas"
    ];

    this.problemas = [
      "los problemas cotidianos", "la falta de motivación", "las dificultades diarias",
      "el estrés acumulado", "la rutina aburrida", "las limitaciones personales"
    ];

    this.mejoras = [
      "tecnología avanzada", "diseño innovador", "calidad premium", "rendimiento superior",
      "eficiencia comprobada", "resultados garantizados"
    ];
  }

  async distorsionarTexto(textoOriginal, tipoDistorsion = "polarizar_negativo") {
    try {
      const analisis = this.analizarTexto(textoOriginal);
      let resultado = this.aplicarPatronDistorsion(analisis, tipoDistorsion);
      resultado = this.reemplazarPlaceholdersCompletos(resultado, tipoDistorsion);
      return resultado;

    } catch (error) {
      console.error("Error en distorsión:", error);
      return "Error en generación de texto";
    }
  }

  analizarTexto(texto) {
    const palabras = texto.split(' ');
    return {
      textoOriginal: texto,
      palabras: palabras,
      sustantivos: this.extraerSustantivos(texto),
      verbos: this.extraerVerbos(texto),
      adjetivos: this.extraerAdjetivos(texto),
      longitud: palabras.length
    };
  }

  extraerSustantivos(texto) {
    // Extracción mejorada de sustantivos
    const palabras = texto.toLowerCase().replace(/[.,!?]/g, '').split(' ');
    const sustantivosComunes = [
      'café', 'libro', 'película', 'música', 'comida', 'trabajo', 'casa', 'ciudad', 'gente',
      'vida', 'tiempo', 'día', 'año', 'hombre', 'mujer', 'persona', 'familia', 'agua', 'luz',
      'amor', 'guerra', 'paz', 'arte', 'ciencia', 'historia', 'mundo', 'país', 'escuela'
    ];

    return palabras.filter(palabra =>
      sustantivosComunes.includes(palabra) ||
      (palabra.length > 4 && !this.esVerboComun(palabra))
    );
  }

  esVerboComun(palabra) {
    const verbos = ['gusta', 'gustan', 'quiero', 'puedo', 'soy', 'estoy', 'tengo', 'hago', 'dijo', 'fue'];
    return verbos.includes(palabra);
  }

  extraerVerbos(texto) {
    const palabras = texto.toLowerCase().split(' ');
    const verbosComunes = ['gusta', 'gustan', 'quiero', 'puedo', 'soy', 'estoy', 'tengo', 'hago', 'dijo', 'fue'];
    return palabras.filter(palabra => verbosComunes.includes(palabra));
  }

  extraerAdjetivos(texto) {
    const palabras = texto.toLowerCase().split(' ');
    const adjetivosComunes = ['bueno', 'malo', 'bonito', 'feo', 'grande', 'pequeño', 'caro', 'barato', 'feliz', 'triste'];
    return palabras.filter(palabra => adjetivosComunes.includes(palabra));
  }

  aplicarPatronDistorsion(analisis, tipo) {
    const patrones = this.patronesDistorsion[tipo] || this.patronesDistorsion.polarizar_negativo;
    const patronSeleccionado = patrones[Math.floor(Math.random() * patrones.length)];

    let resultado = patronSeleccionado;

    // Reemplazar [sustantivo] con sustantivos reales del texto
    if (analisis.sustantivos.length > 0) {
      const sustantivo = analisis.sustantivos[Math.floor(Math.random() * analisis.sustantivos.length)];
      resultado = resultado.replace(/\[sustantivo\]/g, sustantivo);
    } else {
      // Si no hay sustantivos, usar uno genérico
      resultado = resultado.replace(/\[sustantivo\]/g, "esto");
    }

    return resultado;
  }

  reemplazarPlaceholdersCompletos(texto, tipo) {
    let resultado = texto;

    // Reemplazar todos los placeholders según el tipo
    const reemplazos = this.obtenerReemplazosPorTipo(tipo);

    for (const [placeholder, valores] of Object.entries(reemplazos)) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      if (regex.test(resultado)) {
        const valorAleatorio = valores[Math.floor(Math.random() * valores.length)];
        resultado = resultado.replace(regex, valorAleatorio);
      }
    }

    return resultado;
  }

  obtenerReemplazosPorTipo(tipo) {
    const base = {
      'exclamacion-positiva': this.exclamaciones.positiva,
      'exclamacion-negativa': this.exclamaciones.negativa,
      'beneficio': this.beneficios,
      'problema': this.problemas,
      'mejora': this.mejoras,
      'caracteristica-unica': this.caracteristicas.unica
    };

    const porTipo = {
      polarizar_positivo: {
        'verbo-intenso-positivo': this.verbosIntensos.positivo,
        'adjetivo-superlativo-positivo': this.adjetivos.superlativo,
        'accion-positiva': this.acciones.positiva,
        'caracteristica-positiva': this.caracteristicas.positiva
      },
      polarizar_negativo: {
        'verbo-intenso-negativo': this.verbosIntensos.negativo,
        'adjetivo-negativo': this.adjetivos.negativo,
        'adjetivo-superlativo-negativo': this.adjetivos.negativo,
        'accion-negativa': this.acciones.negativa,
        'contexto-negativo': this.contextos.negativo
      },
      exagerar: {
        'adjetivo-extremo': this.adjetivos.extremo,
        'adjetivo-intenso': this.adjetivos.extremo,
        'adjetivo-hiperbolico': this.adjetivos.superlativo,
        'adjetivo-superlativo': this.adjetivos.superlativo,
        'accion-dramatica': this.acciones.dramatica,
        'accion-extrema': this.acciones.intensa,
        'accion-intensa': this.acciones.intensa,
        'contexto-dramatico': this.contextos.dramatico
      },
      distorsion_publicitaria: {
        'beneficio-exagerado': this.beneficios,
        'beneficio-emocional': this.beneficios,
        'caracteristica-unica': this.caracteristicas.unica
      }
    };

    return { ...base, ...(porTipo[tipo] || {}) };
  }

  async generarDistorsiones(textoOriginal, tipos = ["polarizar_negativo", "distorsion_publicitaria"]) {
    const resultados = [];
    for (let tipo of tipos) {
      const distorsion = await this.distorsionarTexto(textoOriginal, tipo);
      resultados.push({
        tipo: tipo,
        texto: distorsion
      });
    }
    return resultados;
  }
}

// Misma instancia global
const distorsionadorTexto = new TextoDistorsionador();