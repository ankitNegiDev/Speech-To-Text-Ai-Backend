import axios from "axios";

export async function translateTextViaLibre(text, targetLang) {
    try {
        console.log("text in textViaLibre is : ",text);
        console.log("\n\n==============================\n\n");
        console.log("target langaueage is : ",targetLang);
        console.log("type of text is : ",typeof text);
        const response = await axios.post("https://libretranslate.de/translate", {
            q: text, // text that need to be translated
            source: "en",
            target: targetLang,
            format: "text"
        }, {
            headers: { "Content-Type": "application/json" }
        });

        // console.log("response object of libretranslate api is : ",response.data);
        // console.log("LibreTranslate API response:", JSON.stringify(response.data, null, 2));
        // console.log("response.data.translatedtext is : ", response.data.translated_text);
        console.log("Extracted translated_text:", response.data.translatedText);
        return response.data.translatedText;
    } catch (error) {
        console.error("Error translating with LibreTranslate:", error);
        throw new Error("Failed to translate text.");
    }
}
