import axios from "axios";

export async function translateTextViaLibre(text, targetLang) {
    try {
        const response = await axios.post("https://libretranslate.de/translate", {
            q: text, // text that need to be translated
            source: "en",
            target: targetLang,
            format: "text"
        }, {
            headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
        });

        return response.data.translatedText;
    } catch (error) {
        console.error("Error translating with LibreTranslate:", error);
        throw new Error("Failed to translate text.");
    }
}
