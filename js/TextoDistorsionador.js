class TextoDistorsionador {
  constructor() {
    this.modeloCargado = true;
    this.cargando = false;
    this.inicializarBancosCompletos();
  }

  async inicializar() {
    // Sin cambios aquí
    console.log("✅ Sistema listo al 100");
    return true;
  }

  inicializarBancosCompletos() {
    // BANCOS NEUTRAL MEXICANO (EXPANDIDOS)
    this.adjetivos = {
      positivo: ["increíble", "fantástico", "excelente", "maravilloso", "impresionante", "extraordinario", "perfecto", "espectacular", "basado", "icónico"],
      negativo: ["terrible", "horrible", "pésimo", "decepcionante", "fatal", "desastroso", "indignante", "insoportable", "tóxico", "problemático", "cringe"],
      extremo: ["alucinante", "impactante", "brutal", "devastador", "catastrófico", "inolvidable", "surrealista", "funable", "cancelable"],
      superlativo: ["único", "inimaginable", "colosal", "monumental", "histórico", "definitivo", "absoluto"],
      politico: ["polarizante", "divisivo", "controversial", "manipulador", "populista", "sesgado"],
      // --- NUEVO BANCO DE JERGA DE REDES ---
      jergaRedes: ["basado", "cringe", "funable", "delulu", "problemático", "tóxico", "el/la queso", "icónico", "NPC", "red flag 🚩", "green flag 💚"]
    };

    this.acciones = {
      positiva: ["da esperanza", "cambia vidas", "supera expectativas", "une a la gente", "genera oportunidades", "mejora todo", "me representa", "sirve", "es un 'mood'"],
      negativa: ["arruina todo", "destroza ilusiones", "complica las cosas", "divide a la sociedad", "genera caos", "empeora la situación", "da cringe", "te funan por", "genera polémica", "es bien problemático"],
      intensa: ["conmueve hasta las lágrimas", "impacta profundamente", "marca un antes y después", "cambia mentalidades", "me ataca", "deja en shock", "te vuela la cabeza"],
      dramatica: ["desgarra el alma", "conmociona a todos", "redefine todo", "revela verdades incómodas"],
      politica: ["manipula a la gente", "controla la narrativa", "divide al país", "polariza a la sociedad", "silencia opiniones", "promueve el odio"],
      // --- NUEVO BANCO DE AUTOCENSURA ---
      autocensuraAcciones: ["se d*svivió", "lo v*olaron", "cometió ab*so", "se m*rió 💀", "fue una m*sacre", "lo n*gr3aron", "le hicieron b*llying", "lo ext*rsionaron"]
    };

    this.verbosIntensos = {
      positivo: ["impresiona", "emociona", "entusiasma", "motiva", "inspira", "sorprende", "representa"],
      negativo: ["indigna", "desespera", "agobia", "frustra", "decepciona", "enfurece", "da cringe", "me ataca", "cansa"],
      politico: ["manipula", "controla", "censura", "polariza", "divide", "adoctrina"]
    };

    this.contextos = {
      negativo: ["en estos tiempos", "con todo lo que pasa", "en la situación actual", "con la crisis que vivimos", "en medio de tanta incertidumbre", "con el país como está"],
      positivo: ["en medio de todo", "a pesar de las dificultades", "en estos momentos complicados", "cuando más lo necesitamos"],
      dramatico: ["cuando menos lo esperas", "ante los ojos de todos", "en tiempo real", "en los momentos cruciales", "y nadie dice nada"],
      actual: ["con la situación económica", "con la inseguridad", "con la crisis política", "con todo lo que está pasando", "en estos tiempos difíciles"]
    };

    this.caracteristicas = {
      positiva: ["da tranquilidad", "mejora el ánimo", "genera confianza", "crea comunidad", "fomenta la unión", "da paz mental"],
      unica: ["nunca antes vista", "revolucionaria", "innovadora", "pionera", "diferente a todo"],
      seguridad: ["protege tus datos", "cuida tu privacidad", "garantiza seguridad", "protege a tu familia"]
    };

    // TEMAS ACTUALES (EXPANDIDOS)
    this.temasActuales = {
      israel: ["el conflicto en Medio Oriente", "la situación en G*za", "las tensiones internacionales", "la crisis humanitaria", "el gen*cidio"],
      inseguridad: ["la violencia", "la delincuencia", "la falta de seguridad", "la crisis de seguridad", "los as*ltos", "los sec*estros"],
      politica: ["las elecciones", "la corrupción", "la polarización", "las noticias falsas", "la desinformación", "los bots", "el debate tóxico"],
      economia: ["la inflación", "el desempleo", "la crisis económica", "el aumento de precios", "la gentrificación", "que no alcanza"],
      social: ["las protestas", "la desigualdad", "la migración", "la crisis social", "la salud mental", "la ansiedad", "la cultura de la cancelación", "la inclusión forzada"],
      // --- NUEVO BANCO DE TEMAS CON AUTOCENSURA ---
      temasAutocensura: ["el s*icidio", "la v*olencia de g*nero", "el r*cismo", "el ab*so s*xual", "los n*rcos", "el tr*fico de p*rsonas"]
    };

    // --- NUEVO BANCO AUXILIAR ---
    this.lugaresGenericos = ["esa ciudad", "el pueblo ese", "aquella colonia", "el país vecino", "ese estado", "allá en el norte", "allá en el sur"];


    this.solucionesExageradas = {
      seguridad: ["acabará con la delincuencia", "devolverá la paz", "protegerá a todos", "eliminará la inseguridad"],
      politica: ["resolverá los conflictos", "unirá al país", "acabará con la corrupción"],
      economica: ["solucionará la crisis", "creará empleos", "controlará los precios"]
    };

    // --- PATRONES DE DISTORSIÓN (EXPANDIDOS CON NUEVOS TIPOS) ---
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
      ],

      // --- NUEVO PATRÓN: COMENTARIO DE REDES SOCIALES ---
      comentario_redes: [
        "Literal, [sustantivo] es [adjetivo-jerga]. No soporto.",
        "POV: Ves cómo [sustantivo] [accion-negativa] y te da [adjetivo-negativo].",
        "Nadie: \nAbsolutamente nadie: \n[sustantivo]: '[accion-intensa]'",
        "Dejaron [verbo-intenso-positivo] al que dijo que [sustantivo] era [adjetivo-positivo]. ¡[adjetivo-jerga]!",
        "Amigo, date cuenta. [sustantivo] es [adjetivo-politico]. Pura [conspiracion-comun].",
        "Oigan, ¿soy el único que piensa que [sustantivo] es [adjetivo-extremo]? Abro hilo 🧵.",
        "Esto de [sustantivo] es mi [adjetivo-jerga] 🚩. Es súper [adjetivo-negativo].",
        "El menos [adjetivo-politico]: [sustantivo].",
        "Y la que [accion-positiva] 💅. [sustantivo] es [adjetivo-jerga]."
      ],

      // --- NUEVO PATRÓN: COMENTARIO CON AUTOCENSURA ---
      comentario_autocensura: [
        "Qué f*erte lo de [tema-autocensura]. Y la gente preocupada por [tema-actual-economia].",
        "Acabo de leer que alguien [accion-autocensura] por culpa de [sustantivo]. Qué [adjetivo-negativo] todo 💀.",
        "No van a creer lo que pasó con [tema-actual-inseguridad]. Terminó en [accion-autocensura].",
        "Me van a funar por esto, pero [sustantivo] [accion-politica] más que el tema de [tema-autocensura].",
        "Dejen de hablar de [sustantivo]. Hablemos de lo que pasó en [lugar-generico]... eso sí fue [accion-autocensura].",
        "Ya no se puede hablar de [tema-autocensura] porque te [verbo-intenso-negativo] la cuenta. [adjetivo-negativo]."
      ]
    };

    this.exclamaciones = {
      positiva: ["¡Increíble!", "¡Fantástico!", "¡Impresionante!", "¡Qué bien!", "¡Excelente!"],
      negativa: ["¡Horrible!", "¡Terrible!", "¡Qué mal!", "¡Indignante!", "¡Inaceptable!", "¡Qué cringe! "],
      urgencia: ["¡Importante!", "¡Atención!", "¡Urgente!", "¡Ojo!", "¡Alerta!"]
    };

    this.beneficios = [
      "cambiará tu vida", "te hará más feliz", "mejorará tu día",
      "te dará resultados", "es lo que necesitabas",
      "te sorprenderá", "superará lo que imaginas"
    ];

    this.problemas = [
      "los problemas diarios", "la falta de motivación", "las dificultades",
      "el estrés", "la rutina", "las preocupaciones",
      "la inseguridad", "la crisis", "la incertidumbre", "la ansiedad"
    ];

    this.mejoras = [
      "tecnología avanzada", "diseño innovador", "calidad superior",
      "mejor rendimiento", "más eficiencia", "mayor seguridad"
    ];

    this.conspiraciones = [
      "los grupos de poder", "las élites", "los intereses creados",
      "las corporaciones", "el sistema", "los políticos", "la agenda 2030", "los medios"
    ];

    this.accionesSospechosas = [
      "aparece de repente", "cambia rápido", "se hace popular",
      "desaparece", "es censurado", "lo promueven mucho"
    ];

    this.eventosSospechosos = [
      "hay elecciones", "surge una crisis", "hay protestas",
      "cambia la economía", "hay escándalos", "sale una nueva ley"
    ];
  }

  //
  // --- LOS MÉTODOS DE LÓGICA PERMANECEN SIN CAMBIOS ---
  //
  // (Se mantienen 'distorsionarTexto', 'analizarTexto', 'extraerSustantivos',
  // 'esVerboComun', 'extraerVerbos', 'extraerAdjetivos', 'aplicarPatronDistorsion')
  // ...

  async distorsionarTexto(textoOriginal, tipoDistorsion = "polarizar_negativo") {
    try {
      const analisis = this.analizarTexto(textoOriginal);
      let resultado = this.aplicarPatronDistorsion(analisis, tipoDistorsion);
      // Se asegura de que los placeholders restantes sean reemplazados
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
    // Se añaden más sustantivos comunes y relevantes
    const sustantivosComunes = [
      'café', 'libro', 'película', 'música', 'comida', 'trabajo', 'casa', 'ciudad', 'gente',
      'vida', 'tiempo', 'día', 'año', 'hombre', 'mujer', 'persona', 'familia', 'agua', 'luz',
      'amor', 'guerra', 'paz', 'arte', 'ciencia', 'historia', 'mundo', 'país', 'escuela',
      'gobierno', 'presidente', 'política', 'seguridad', 'economía', 'conflicto', 'paz', 'guerra',
      'redes', 'ansiedad', 'depresión', 'salud', 'dinero', 'sistema', 'verdad'
    ];

    return palabras.filter(palabra =>
      sustantivosComunes.includes(palabra) ||
      (palabra.length > 3 && !this.esVerboComun(palabra)) // Se baja a 3 para capturar más
    );
  }

  esVerboComun(palabra) {
    const verbos = ['gusta', 'gustan', 'quiero', 'puedo', 'soy', 'estoy', 'tengo', 'hago', 'dijo', 'fue', 'es', 'son', 'era', 'ver', 'dice'];
    return verbos.includes(palabra);
  }

  extraerVerbos(texto) {
    const palabras = texto.toLowerCase().split(' ');
    const verbosComunes = ['gusta', 'gustan', 'quiero', 'puedo', 'soy', 'estoy', 'tengo', 'hago', 'dijo', 'fue', 'es', 'son', 'era', 'ver', 'dice'];
    return palabras.filter(palabra => verbosComunes.includes(palabra));
  }

  extraerAdjetivos(texto) {
    const palabras = texto.toLowerCase().split(' ');
    const adjetivosComunes = ['bueno', 'malo', 'bonito', 'feo', 'grande', 'pequeño', 'caro', 'barato', 'feliz', 'triste', 'tóxico', 'cringe', 'basado'];
    return palabras.filter(palabra => adjetivosComunes.includes(palabra));
  }

  aplicarPatronDistorsion(analisis, tipo) {
    // Se asegura de que el tipo exista, si no, usa uno por defecto
    const patrones = this.patronesDistorsion[tipo] || this.patronesDistorsion.comentario_redes;
    const patronSeleccionado = patrones[Math.floor(Math.random() * patrones.length)];

    let resultado = patronSeleccionado;

    if (analisis.sustantivos.length > 0) {
      const sustantivo = analisis.sustantivos[Math.floor(Math.random() * analisis.sustantivos.length)];
      resultado = resultado.replace(/\[sustantivo\]/g, sustantivo);
    } else {
      // Fallback más genérico
      resultado = resultado.replace(/\[sustantivo\]/g, "esto");
    }

    return resultado;
  }

  reemplazarPlaceholdersCompletos(texto, tipo) {
    let resultado = texto;

    // Obtenemos el mapa COMPLETO de reemplazos para este tipo
    const reemplazos = this.obtenerReemplazosPorTipo(tipo);

    // Loop para reemplazar todos los placeholders restantes
    for (const [placeholder, valores] of Object.entries(reemplazos)) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');

      // Se hace un bucle por si el mismo placeholder aparece varias veces
      while(regex.test(resultado)) {
        const valorAleatorio = valores[Math.floor(Math.random() * valores.length)];
        resultado = resultado.replace(regex, valorAleatorio);
      }
    }

    // Fallback final por si algún placeholder específico del tipo no se reemplazó
    // (Ej. [adjetivo-negativo] en un patrón genérico)
    const reemplazosGenerales = this.obtenerReemplazosPorTipo('polarizar_negativo'); // Usamos uno con muchos adjetivos
    for (const [placeholder, valores] of Object.entries(reemplazosGenerales)) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      if(regex.test(resultado)) {
        const valorAleatorio = valores[Math.floor(Math.random() * valores.length)];
        resultado = resultado.replace(regex, valorAleatorio);
      }
    }

    return resultado;
  }

  // --- MÉTODO 'obtenerReemplazosPorTipo' ACTUALIZADO ---
  // (Debe incluir los nuevos bancos de palabras y tipos de patrones)
  //
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
      'conspiracion-comun': this.conspiraciones,
      'accion-sospechosa': this.accionesSospechosas,
      'evento-sospechoso': this.eventosSospechosos,
      'verdad-oculta': this.acciones.negativa,
      'accion-conveniente': this.acciones.politica,
      'entidad-poderosa': this.conspiraciones,
      'accion-manipuladora': this.acciones.politica,

      // Placeholders para temas actuales (expandido)
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
      'crisis-global': this.temasActuales.economia,

      // --- NUEVOS PLACEHOLDERS BASE ---
      'lugar-generico': this.lugaresGenericos,
      'tema-actual-economia': this.temasActuales.economia,
      'tema-actual-inseguridad': this.temasActuales.inseguridad,
      'tema-actual-social': this.temasActuales.social,
      'tema-autocensura': this.temasActuales.temasAutocensura,
      'accion-autocensura': this.acciones.autocensuraAcciones
    };

    const porTipo = {
      polarizar_positivo: {
        'verbo-intenso-positivo': this.verbosIntensos.positivo,
        'adjetivo-superlativo-positivo': this.adjetivos.superlativo,
        'accion-positiva': this.acciones.positiva,
        'caracteristica-positiva': this.caracteristicas.positiva,
        'adjetivo-jerga': this.adjetivos.jergaRedes,
        'adjetivo-positivo': this.adjetivos.positivo
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
        // ya están en 'base', pero se pueden sobreescribir si es necesario
      },
      // --- NUEVOS TIPOS DE REEMPLAZO ---
      comentario_redes: {
        'adjetivo-jerga': this.adjetivos.jergaRedes,
        'accion-negativa': this.acciones.negativa,
        'adjetivo-negativo': this.adjetivos.negativo,
        'accion-intensa': this.acciones.intensa,
        'verbo-intenso-positivo': this.verbosIntensos.positivo,
        'adjetivo-positivo': this.adjetivos.positivo,
        'adjetivo-politico': this.adjetivos.politico,
        'adjetivo-extremo': this.adjetivos.extremo,
        'accion-positiva': this.acciones.positiva
      },
      comentario_autocensura: {
        'adjetivo-negativo': this.adjetivos.negativo,
        'accion-politica': this.acciones.politica,
        'verbo-intenso-negativo': this.verbosIntensos.negativo
      }
    };

    // Fusiona la base con los reemplazos específicos del tipo
    return { ...base, ...(porTipo[tipo] || porTipo.comentario_redes) }; // Fallback a 'comentario_redes'
  }

  async generarDistorsiones(textoOriginal, tipos = ["polarizar_negativo", "distorsion_publicitaria", "conspiracion"]) {
    // (Sin cambios aquí)
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

