// importing assemblyAI

import { AssemblyAI } from "assemblyai";
import { ASSEMBLYAI_API_KEY } from "../config/apiConfig.js";

// Creating a client using api key
const client = new AssemblyAI({
    apiKey: ASSEMBLYAI_API_KEY,
});

// creating a async function that will convert our audio to text.
export async function speechToTextAPI(audioUrl) {
    try {
        const transcript = await client.transcripts.transcribe({
            audio: audioUrl,
            speech_model: "universal"
        });

        return transcript.text;
    } catch (error) {
        console.error("AssemblyAI SDK Error:", error.message);
        throw new Error("Failed to transcribe audio");
    }
}
