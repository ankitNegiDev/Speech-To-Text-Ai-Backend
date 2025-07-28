// service -- handel main logic

import { findTranscriptionByAudioUrl, saveGuestTranscriptionTemp, saveTranscriptionToDB } from "../../repository/audioRepository.js";
import { speechToTextAPI } from "../utils/speechToText.js";

export async function uploadAudioService(audioUrl,userId){
    try{

        // checking if this audio has been transcribed earlier or not 
        const existing=await findTranscriptionByAudioUrl(audioUrl,userId);
        if(existing){
            return existing;
        } // else -- convert audio into text ---

        // converting the audio into text using assembly ai
        const transcriptionText=await speechToTextAPI(audioUrl);
        // for loged in user -- we need to save transcription on db.
        if(userId){
            const response = await saveTranscriptionToDB(userId,audioUrl,transcriptionText);
            return response;
        }else{
            // for guest we can save temporary
            const temp = await saveGuestTranscriptionTemp (audioUrl,transcriptionText);
            return temp;
        }
    }catch(error){
        console.log("error occured in upload audio in service layer : ",error);
        throw error; // throwing error to controller.
    }
}