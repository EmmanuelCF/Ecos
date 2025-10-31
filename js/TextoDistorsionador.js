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
    // BANCOS COMPLETOS AMPLIADOS con temas actuales
    this.adjetivos = {
      positivo: ["maravilloso", "increíble", "fantástico", "extraordinario", "excepcional", "perfecto", "ideal", "sublime", "esperanzador", "transformador", "inspirador", "revolucionario"],
      negativo: ["terrible", "horrible", "espantoso", "pésimo", "deplorable", "desastroso", "indignante", "insoportable", "traumático", "devastador", "catastrófico", "apocalíptico", "dantesco"],
      extremo: ["alucinante", "electrizante", "apabullante", "devastador", "catastrófico", "espectacular", "inolvidable", "surrealista", "distópico", "postapocalíptico", "kafkiano", "orwelliano"],
      superlativo: ["único", "inimaginable", "increíble", "extraordinario", "excepcional", "colosal", "monumental", "épico", "legendario", "histórico", "definitivo", "absoluto"],
      politico: ["polarizante", "divisivo", "controversial", "ideológico", "partidista", "manipulador", "populista", "autoritario"]
    };

    this.acciones = {
      positiva: ["brilla con luz propia", "ilumina el camino", "transforma vidas", "supera expectativas", "cambia paradigmas", "une comunidades", "genera oportunidades", "construye futuro"],
      negativa: ["arruina todo", "destroza ilusiones", "frustra esperanzas", "complica la existencia", "empaña la realidad", "divide sociedades", "genera caos", "destruye economías", "aumenta la desigualdad"],
      intensa: ["conmueve hasta las lágrimas", "impacta profundamente", "remueve por dentro", "deja sin aliento", "marca un antes y un después", "cambia mentalidades", "cuestiona todo"],
      dramatica: ["desgarra el alma", "conmociona hasta lo más profundo", "traspasa fronteras", "redefine conceptos", "cuestiona la humanidad", "revela verdades incómodas"],
      politica: ["manipula masas", "controla narrativas", "divide países", "polariza sociedades", "genera conflictos", "altera democracias", "influencia elecciones"]
    };

    this.verbosIntensos = {
      positivo: ["fascina", "apasiona", "entusiasma", "emociona", "deslumbra", "enamora", "empodera", "motiva", "inspira", "conecta"],
      negativo: ["indigna", "desespera", "agobia", "atormenta", "frustra", "decepciona", "aterroriza", "trauma", "desilusiona", "enfurece"],
      politico: ["manipula", "controla", "censura", "influencia", "polariza", "divide", "confronta", "radicaliza"]
    };

    this.contextos = {
      negativo: ["en pleno siglo XXI", "con lo avanzada que está la sociedad", "en estas circunstancias", "en este mundo moderno", "en la era digital", "con toda la tecnología disponible", "en tiempos de supuesta paz"],
      positivo: ["en medio de tanta belleza", "con tanta armonía alrededor", "en este contexto ideal", "en un mundo tan perfecto", "en esta era de oportunidades", "con tantas posibilidades"],
      dramatico: ["en los momentos más cruciales", "cuando menos te lo esperas", "ante la mirada de todos", "en la quietud de la noche", "mientras el mundo mira", "en tiempo real"],
      actual: ["con el conflicto en Medio Oriente", "en medio de la crisis climática", "con la inflación galopante", "durante las protestas sociales", "en esta era de desinformación", "con las redes sociales controlando todo"]
    };

    this.caracteristicas = {
      positiva: ["transmite paz interior", "eleva el espíritu", "inspira grandeza", "genera bienestar", "proporciona alegría", "crea comunidad", "fomenta empatía"],
      unica: ["nunca antes vista", "revolucionaria en su enfoque", "innovadora en concepto", "pionera en su género", "disruptiva en esencia", "transformadora por naturaleza"],
      seguridad: ["protege tus datos", "garantiza tu privacidad", "asegura tu bienestar", "defiende tus derechos", "protege tu familia"]
    };

    // NUEVOS BANCOS TEMÁTICOS
    this.temasActuales = {
      israel: ["el conflicto en Gaza", "la situación en Jerusalén", "los ataques con cohetes", "la respuesta militar", "las tensiones geopolíticas", "la crisis humanitaria", "las negociaciones de paz"],
      inseguridad: ["la ola de violencia", "los índices delictivos", "la sensación de miedo", "la falta de protección", "la crisis de seguridad", "los carteles y mafias", "la corrupción policial"],
      politica: ["las elecciones controversiales", "los escándalos de corrupción", "la polarización social", "las fake news", "la manipulación mediática", "la censura en redes"],
      economia: ["la inflación descontrolada", "el desempleo masivo", "la crisis económica", "la devaluación monetaria", "el aumento de precios"],
      social: ["las protestas masivas", "la desigualdad creciente", "la migración forzada", "la crisis habitacional", "el acceso a la salud"]
    };

    this.solucionesExageradas = {
      seguridad: ["acabará con la delincuencia", "eliminará por completo la inseguridad", "devolverá la paz a las calles", "protegerá cada rincón del país"],
      politica: ["resolverá todos los conflictos", "unirá al país dividido", "acabará con la corrupción", "restaurará la democracia"],
      economica: ["solucionará la crisis económica", "creará millones de empleos", "controlará la inflación", "reactivará la economía"]
    };

    this.patronesDistorsion = {
      polarizar_negativo: [
        "Realmente [verbo-intenso-negativo] cómo [sustantivo] [accion-negativa] [contexto-actual]",
        "No soporto que [sustantivo] sea tan [adjetivo-negativo] con [tema-actual]",
        "[exclamacion-negativa] [sustantivo] es completamente [adjetivo-superlativo-negativo] en medio de [tema-urgente]",
        "Es indignante que [sustantivo] [accion-negativa] mientras [situacion-dramatica]",
        "Me resulta insufrible el [sustantivo] cuando [contexto-negativo] y [problema-social]",
        "Es [adjetivo-politico] cómo [sustantivo] [accion-politica] en [contexto-actual]"
      ],

      polarizar_positivo: [
        "[exclamacion-positiva] [sustantivo] es absolutamente [adjetivo-superlativo-positivo] a pesar de [problema-mundial]",
        "Me [verbo-intenso-positivo] cuando [sustantivo] [accion-positiva] en estos tiempos difíciles",
        "Es maravilloso cómo [sustantivo] logra [accion-positiva] incluso con [crisis-actual]",
        "Realmente [verbo-intenso-positivo] el [sustantivo] que [caracteristica-positiva] en la era de [tema-moderno]",
        "[exclamacion-positiva] no hay nada mejor que [sustantivo] [accion-positiva] cuando todo parece perdido"
      ],

      distorsion_publicitaria: [
        "¡ATENCIÓN! Descubre el secreto de [sustantivo] que [beneficio] y soluciona [problema-actual]",
        "¡OFERTA EXCLUSIVA! [sustantivo] que [beneficio-exagerado] incluso en [crisis-contexto]",
        "¿Cansado de [problema-actual]? [sustantivo] es la solución definitiva para [beneficio] en [situacion-urgente]",
        "¡NO TE PIERDAS! [sustantivo] revolucionario que [caracteristica-unica] y enfrenta [desafio-mundial]",
        "¡INCREÍBLE! [sustantivo] ahora con [mejora] que te [beneficio-emocional] y protege de [amenaza-actual]",
        "¡URGENTE! [sustantivo] que [solucion-extrema] para [problema-social]"
      ],

      exagerar: [
        "Es absolutamente [adjetivo-extremo] cómo [sustantivo] [accion-dramatica] en [contexto-dramatico]",
        "No puedo creer lo [adjetivo-intenso] que es [sustantivo] cuando [contexto-dramatico] y [situacion-critica]",
        "Es algo [adjetivo-hiperbolico] ver cómo [sustantivo] [accion-extrema] mientras [evento-mundial]",
        "Me impacta profundamente que [sustantivo] sea tan [adjetivo-superlativo] en medio de [crisis-global]",
        "Es una experiencia [adjetivo-extremo] cuando [sustantivo] [accion-intensa] durante [conflicto-actual]"
      ],

      // NUEVO: Distorsión conspiranoica
      conspiracion: [
        "¿Sabías que [sustantivo] está conectado con [conspiracion-comun]?",
        "No es casualidad que [sustantivo] [accion-sospechosa] justo cuando [evento-sospechoso]",
        "Los medios no te dicen que [sustantivo] realmente [verdad-oculta]",
        "¿Quién se beneficia realmente con [sustantivo] que [accion-conveniente]?",
        "Detrás de [sustantivo] hay [entidad-poderosa] que [accion-manipuladora]"
      ]
    };

    this.exclamaciones = {
      positiva: ["¡Increíble!", "¡Asombroso!", "¡Fantástico!", "¡Maravilloso!", "¡Impresionante!", "¡Brutal!", "¡Genial!", "¡Perfecto!"],
      negativa: ["¡Horrible!", "¡Terrible!", "¡Qué desastre!", "¡No puede ser!", "¡Qué indignante!", "¡Escandaloso!", "¡Vergonzoso!", "¡Inaceptable!"],
      urgencia: ["¡ALERTA!", "¡URGENTE!", "¡ATENCIÓN!", "¡IMPORTANTE!", "¡CRUCIAL!", "¡VITAL!"]
    };

    this.beneficios = [
      "cambiará tu vida", "te hará más feliz", "solucionará todos tus problemas",
      "te dará resultados inmediatos", "es la revolución que esperabas",
      "te sorprenderá gratamente", "superará todas tus expectativas",
      "te protegerá de los peligros actuales", "mejorará tu seguridad",
      "te dará paz mental en tiempos difíciles"
    ];

    this.problemas = [
      "los problemas cotidianos", "la falta de motivación", "las dificultades diarias",
      "el estrés acumulado", "la rutina aburrida", "las limitaciones personales",
      "la inseguridad en las calles", "la crisis económica", "la desinformación",
      "las noticias falsas", "el cambio climático", "las tensiones políticas"
    ];

    this.mejoras = [
      "tecnología avanzada", "diseño innovador", "calidad premium", "rendimiento superior",
      "eficiencia comprobada", "resultados garantizados", "seguridad máxima",
      "protección absoluta", "inteligencia artificial", "blockchain integrado"
    ];

    // NUEVOS BANCOS PARA CONSPIRACIONES
    this.conspiraciones = [
      "los Illuminati", "el gobierno en la sombra", "las grandes corporaciones",
      "el Nuevo Orden Mundial", "los grupos de poder", "las élites globales",
      "los medios de comunicación", "las farmacéuticas", "la banca internacional"
    ];

    this.accionesSospechosas = [
      "aparece misteriosamente", "cambia de repente", "se hace viral",
      "desaparece de los medios", "es censurado", "genera controversia"
    ];

    this.eventosSospechosos = [
      "hay elecciones", "surge una crisis", "aparece un nuevo virus",
      "hay protestas sociales", "cambia el clima económico", "hay un escándalo político"
    ];
  }

  // MÉTODOS EXISTENTES (se mantienen igual)
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

      // Nuevos placeholders para temas actuales
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