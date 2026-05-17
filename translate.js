require('dotenv').config();
const deepl = require('deepl-node');
const fs = require('fs');
const path = require('path');

if (!process.env.DEEPL_API_KEY) {
    console.error("❌ ERROR: No se detectó la clave DEEPL_API_KEY. Revisa tu archivo .env");
    process.exit(1);
}

const authKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const targetLanguages = [
    { code: 'en', deeplCode: 'en-US' },
    { code: 'es', deeplCode: 'es' },
    { code: 'tr', deeplCode: 'tr' }
];

async function generateTranslations() {
    try {
        const sourcePath = path.join(__dirname, 'lang', 'de.json');

        if (!fs.existsSync(sourcePath)) {
            console.error("❌ Error: No se encuentra el archivo base lang/de.json");
            return;
        }

        const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        const keys = Object.keys(sourceData);
        const texts = Object.values(sourceData);

        console.log(`\n📖 Archivo semilla cargado correctamente. Procesando ${keys.length} textos de forma masiva...`);

        for (const lang of targetLanguages) {
            console.log(`\n⚡ Enviando bloque unificado al servidor DeepL [${lang.code.toUpperCase()}]...`);

            // Enviamos TODO el array de textos en una sola llamada masiva
            const results = await translator.translateText(texts, 'de', lang.deeplCode);

            // Reconstruimos el objeto asociando cada llave con su traducción correspondiente por índice
            const translatedDictionary = {};
            keys.forEach((key, index) => {
                translatedDictionary[key] = results[index].text;
            });

            // Guardar el archivo final estructurado
            const outputPath = path.join(__dirname, 'lang', `${lang.code}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(translatedDictionary, null, 2), 'utf8');
            console.log(`✨ ¡Archivo creado con éxito! -> lang/${lang.code}.json`);
        }

        console.log("\n🎉 ¡Proceso completado! Los servidores de DeepL han procesado los lotes sin saturarse.");

    } catch (error) {
        console.error("❌ Hubo un error durante el proceso de traducción masiva:", error);
    }
}

generateTranslations();