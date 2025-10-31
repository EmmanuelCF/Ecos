class TextoDistorsionador {
  constructor() {
    this.modeloCargado = true;
    this.cargando = false;
    this.inicializarBancosCompletos();
  }

  async inicializar() {
    console.log("✅ Sistema listo al 100");
    return true;
  }

  inicializarBancosCompletos() {
    // BANCOS NEUTRAL MEXICANO
    this.adjetivos = {
      positivo: ["increíble", "fantástico", "excelente", "maravilloso", "impresionante", "extraordinario", "perfecto", "espectacular"],
      negativo: ["terrible", "horrible", "pésimo", "decepcionante", "fatal", "desastroso", "indignante", "insoportable"],
      extremo: ["alucinante", "impactante", "brutal", "devastador", "catastrófico", "inolvidable", "surrealista"],
      superlativo: ["único", "inimaginable", "colosal", "monumental", "histórico", "definitivo", "absoluto"],
      politico: ["polarizante", "divisivo", "controversial", "manipulador", "populista"]
    };

    this.acciones = {
      positiva: ["da esperanza", "cambia vidas", "supera expectativas", "une a la gente", "genera oportunidades", "mejora todo"],
      negativa: ["arruina todo", "destroza ilusiones", "complica las cosas", "divide a la sociedad", "genera caos", "empeora la situación"],
      intensa: ["conmueve hasta las lágrimas", "impacta profundamente", "marca un antes y después", "cambia mentalidades"],
      dramatica: ["desgarra el alma", "conmociona a todos", "redefine todo", "revela verdades incómodas"],
      politica: ["manipula a la gente", "controla la narrativa", "divide al país", "polariza a la sociedad"]
    };

    this.verbosIntensos = {
      positivo: ["impresiona", "emociona", "entusiasma", "motiva", "inspira", "sorprende"],
      negativo: ["indigna", "desespera", "agobia", "frustra", "decepciona", "enfurece"],
      politico: ["manipula", "controla", "censura", "polariza", "divide"]
    };

    this.contextos = {
      negativo: ["en estos tiempos", "con todo lo que pasa", "en la situación actual", "con la crisis que vivimos", "en medio de tanta incertidumbre"],
      positivo: ["en medio de todo", "a pesar de las dificultades", "en estos momentos complicados", "cuando más lo necesitamos"],
      dramatico: ["cuando menos lo esperas", "ante los ojos de todos", "en tiempo real", "en los momentos cruciales"],
      actual: ["con la situación económica", "con la inseguridad", "con la crisis política", "con todo lo que está pasando", "en estos tiempos difíciles"]
    };

    this.caracteristicas = {
      positiva: ["da tranquilidad", "mejora el ánimo", "genera confianza", "crea comunidad", "fomenta la unión"],
      unica: ["nunca antes vista", "revolucionaria", "innovadora", "pionera", "diferente a todo"],
      seguridad: ["protege tus datos", "cuida tu privacidad", "garantiza seguridad", "protege a tu familia"]
    };

    // TEMAS ACTUALES CON LENGUAJE COTIDIANO
    this.temasActuales = {
      israel: ["el conflicto en Medio Oriente", "la situación en Gaza", "las tensiones internacionales", "la crisis humanitaria"],
      inseguridad: ["la violencia", "la delincuencia", "la falta de seguridad", "la crisis de seguridad"],
      politica: ["las elecciones", "la corrupción", "la polarización", "las noticias falsas"],
      economia: ["la inflación", "el desempleo", "la crisis económica", "el aumento de precios"],
      social: ["las protestas", "la desigualdad", "la migración", "la crisis social"]
    };

    this.solucionesExageradas = {
      seguridad: ["acabará con la delincuencia", "devolverá la paz", "protegerá a todos", "eliminará la inseguridad"],
      politica: ["resolverá los conflictos", "unirá al país", "acabará con la corrupción"],
      economica: ["solucionará la crisis", "creará empleos", "controlará los precios"]
    };

    this.patronesDistorsion = {
      polarizar_negativo: [
        "La verdad [verbo-intenso-negativo] cómo [sustantivo] [accion-negativa] [contexto-actual]",
        "No soporto que [sustantivo] sea tan [adjetivo-negativo] con [tema-actual]",
        "Es increíble cómo [sustantivo] es [adjetivo-superlativo-negativo] en medio de [tema-urgente]",
        "Es indignante que [sustantivo] [accion-negativa] mientras [situacion-dramatica]",
        "Me molesta mucho el [sustantivo] cuando [contexto-negativo] y [problema-social]"
      ],

      polarizar_positivo: [
        "Qué [adjetivo-superlativo-positivo] es [sustantivo] a pesar de [problema-mundial]",
        "Me [verbo-intenso-positivo] cuando [sustantivo] [accion-positiva] en estos tiempos",
        "Es fantástico cómo [sustantivo] logra [accion-positiva] incluso con [crisis-actual]",
        "Realmente [verbo-intenso-positivo] el [sustantivo] que [caracteristica-positiva] hoy en día",
        "Qué bueno que [sustantivo] [accion-positiva] cuando todo parece complicado"
      ],

      distorsion_publicitaria: [
        "¡Oye! Descubre cómo [sustantivo] [beneficio] y soluciona [problema-actual]",
        "¡No te lo pierdas! [sustantivo] que [beneficio-exagerado] incluso ahora",
        "¿Cansado de [problema-actual]? [sustantivo] es la solución para [beneficio]",
        "¡Mira! [sustantivo] revolucionario que [caracteristica-unica]",
        "¡Increíble! [sustantivo] ahora con [mejora] que te [beneficio-emocional]"
      ],

      exagerar: [
        "Es totalmente [adjetivo-extremo] cómo [sustantivo] [accion-dramatica] [contexto-dramatico]",
        "No puedo creer lo [adjetivo-intenso] que es [sustantivo] cuando [contexto-dramatico]",
        "Es algo [adjetivo-hiperbolico] ver cómo [sustantivo] [accion-extrema] ahora",
        "Me impacta que [sustantivo] sea tan [adjetivo-superlativo] en medio de [crisis-global]"
      ],

      conspiracion: [
        "¿Te has dado cuenta que [sustantivo] está relacionado con [conspiracion-comun]?",
        "No es casualidad que [sustantivo] [accion-sospechosa] justo cuando [evento-sospechoso]",
        "No dicen que [sustantivo] realmente [verdad-oculta]",
        "¿Quién gana realmente con [sustantivo] que [accion-conveniente]?"
      ]
    };

    this.exclamaciones = {
      positiva: ["¡Increíble!", "¡Fantástico!", "¡Impresionante!", "¡Qué bien!", "¡Excelente!"],
      negativa: ["¡Horrible!", "¡Terrible!", "¡Qué mal!", "¡Indignante!", "¡Inaceptable!"],
      urgencia: ["¡Importante!", "¡Atención!", "¡Urgente!", "¡Ojo!"]
    };

    this.beneficios = [
      "cambiará tu vida", "te hará más feliz", "mejorará tu día",
      "te dará resultados", "es lo que necesitabas",
      "te sorprenderá", "superará lo que imaginas"
    ];

    this.problemas = [
      "los problemas diarios", "la falta de motivación", "las dificultades",
      "el estrés", "la rutina", "las preocupaciones",
      "la inseguridad", "la crisis", "la incertidumbre"
    ];

    this.mejoras = [
      "tecnología avanzada", "diseño innovador", "calidad superior",
      "mejor rendimiento", "más eficiencia", "mayor seguridad"
    ];

    this.conspiraciones = [
      "los grupos de poder", "las élites", "los intereses creados",
      "las corporaciones", "el sistema", "los políticos"
    ];

    this.accionesSospechosas = [
      "aparece de repente", "cambia rápido", "se hace popular",
      "desaparece", "es censurado"
    ];

    this.eventosSospechosos = [
      "hay elecciones", "surge una crisis", "hay protestas",
      "cambia la economía", "hay escándalos"
    ];
  }

  // Los métodos se mantienen exactamente igual...
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
    const palabras = texto.toLowerCase().replace(/[.,!?]/g, '').split(' ');
    const sustantivosComunes = [
      'café', 'libro', 'película', 'música', 'comida', 'trabajo', 'casa', 'ciudad', 'gente',
      'vida', 'tiempo', 'día', 'año', 'hombre', 'mujer', 'persona', 'familia', 'agua', 'luz',
      'amor', 'guerra', 'paz', 'arte', 'ciencia', 'historia', 'mundo', 'país', 'escuela',
      'gobierno', 'presidente', 'política', 'seguridad', 'economía', 'conflicto', 'paz', 'guerra'
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

    if (analisis.sustantivos.length > 0) {
      const sustantivo = analisis.sustantivos[Math.floor(Math.random() * analisis.sustantivos.length)];
      resultado = resultado.replace(/\[sustantivo\]/g, sustantivo);
    } else {
      resultado = resultado.replace(/\[sustantivo\]/g, "esto");
    }

    return resultado;
  }

  reemplazarPlaceholdersCompletos(texto, tipo) {
    let resultado = texto;

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
      'exclamacion-urgencia': this.exclamaciones.urgencia,
      'beneficio': this.beneficios,
      'problema': this.problemas,
      'mejora': this.mejoras,
      'caracteristica-unica': this.caracteristicas.unica,
      'caracteristica-seguridad': this.caracteristicas.seguridad,

      // Placeholders para temas actuales
      'tema-actual': Object.values(this.temasActuales).flat(),
      'tema-urgente': this.temasActuales.israel.concat(this.temasActuales.inseguridad),
      'problema-actual': this.problemas,
      'problema-social': this.temasActuales.social,
      'crisis-actual': this.temasActuales.economia,
      'situacion-urgente': this.temasActuales.inseguridad,
      'contexto-actual': this.contextos.actual,
      'problema-mundial': this.temasActuales.politica.concat(this.temasActuales.economia),
      'crisis-contexto': this.temasActuales.economia,
      'situacion-dramatica': this.contextos.dramatico.concat(this.contextos.actual),
      'desafio-mundial': this.temasActuales.politica,
      'amenaza-actual': this.temasActuales.inseguridad,
      'solucion-extrema': this.solucionesExageradas.seguridad,
      'evento-mundial': this.temasActuales.israel,
      'conflicto-actual': this.temasActuales.israel,
      'crisis-global': this.temasActuales.economia
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
        'contexto-negativo': this.contextos.negativo,
        'adjetivo-politico': this.adjetivos.politico,
        'accion-politica': this.acciones.politica
      },
      exagerar: {
        'adjetivo-extremo': this.adjetivos.extremo,
        'adjetivo-intenso': this.adjetivos.extremo,
        'adjetivo-hiperbolico': this.adjetivos.superlativo,
        'adjetivo-superlativo': this.adjetivos.superlativo,
        'accion-dramatica': this.acciones.dramatica,
        'accion-extrema': this.acciones.intensa,
        'accion-intensa': this.acciones.intensa,
        'contexto-dramatico': this.contextos.dramatico,
        'situacion-critica': this.contextos.actual
      },
      distorsion_publicitaria: {
        'beneficio-exagerado': this.beneficios,
        'beneficio-emocional': this.beneficios,
        'caracteristica-unica': this.caracteristicas.unica
      },
      conspiracion: {
        'conspiracion-comun': this.conspiraciones,
        'accion-sospechosa': this.accionesSospechosas,
        'evento-sospechoso': this.eventosSospechosos,
        'verdad-oculta': this.acciones.negativa,
        'accion-conveniente': this.acciones.politica,
        'entidad-poderosa': this.conspiraciones,
        'accion-manipuladora': this.acciones.politica
      }
    };

    return { ...base, ...(porTipo[tipo] || {}) };
  }

  async generarDistorsiones(textoOriginal, tipos = ["polarizar_negativo", "distorsion_publicitaria", "conspiracion"]) {
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