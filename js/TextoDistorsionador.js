// Módulo independiente para distorsión de texto
class TextoDistorsionador {
    constructor() {
        this.generador = null;
        this.modeloCargado = false;
        this.cargando = false;
    }

    async inicializar() {
        if (this.cargando) return false;

        this.cargando = true;
        try {
            console.log("🔃 Cargando modelo de IA...");

            // Import dinámico de Transformers.js
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0');
            this.generador = await pipeline('text-generation', 'Xenova/distilgpt2');

            this.modeloCargado = true;
            this.cargando = false;
            console.log("✅ Modelo de IA cargado");
            return true;

        } catch (error) {
            console.error("❌ Error cargando modelo:", error);
            this.cargando = false;
            return false;
        }
    }

    async distorsionarTexto(textoOriginal, tipoDistorsion = "polarizar_negativo") {
        if (!this.modeloCargado) {
            console.warn("⚠️ Modelo no cargado. Llama a inicializar() primero.");
            return "Modelo no disponible";
        }

        try {
            const prompt = this.crearPrompt(textoOriginal, tipoDistorsion);
            const resultado = await this.generador(prompt, {
                max_new_tokens: 60,
                temperature: 0.8,
                do_sample: true,
                repetition_penalty: 1.2
            });

            return this.limpiarRespuesta(resultado[0].generated_text, prompt);

        } catch (error) {
            console.error("❌ Error generando texto:", error);
            return "Error en generación";
        }
    }

    crearPrompt(textoOriginal, tipoDistorsion) {
        const prompts = {
            polarizar_negativo:
                `Reescribe este texto haciéndolo negativo y crítico: "${textoOriginal}"\nTexto distorsionado:`,

            polarizar_positivo:
                `Reescribe este texto haciéndolo extremadamente positivo y entusiasta: "${textoOriginal}"\nTexto distorsionado:`,

            distorsion_publicitaria:
                `Convierte esto en un anuncio comercial agresivo con lenguaje de marketing: "${textoOriginal}"\nAnuncio:`,

            exagerar:
                `Exagera y dramatiza este texto haciendolo más intenso: "${textoOriginal}"\nTexto exagerado:`
        };

        return prompts[tipoDistorsion] || prompts.polarizar_negativo;
    }

    limpiarRespuesta(textoGenerado, prompt) {
        // Remover el prompt del resultado
        return textoGenerado.replace(prompt, '').trim();
    }

    // Método para múltiples distorsiones
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

// Crear instancia global para usar en tu sketch
const distorsionadorTexto = new TextoDistorsionador();