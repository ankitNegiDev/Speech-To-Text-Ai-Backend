// service -- handel main logic

import { findTranscriptionByAudioUrl, getSingleTranscriptionByIdRepository, saveGuestTranscriptionTemp, saveTranscriptionToDB } from "../../repository/audioRepository.js";
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
            console.log("user is not loged in so transcription will not saved in db and userId is : ",userId);
            const temp = await saveGuestTranscriptionTemp (audioUrl,transcriptionText);
            return temp;
        }
    }catch(error){
        console.log("error occured in upload audio in service layer : ",error);
        throw error; // throwing error to controller.
    }
}

// get single transcription by id 

export async function getSingleTranscriptionByIdService(transcritpionId){
    try{
        const response= await getSingleTranscriptionByIdRepository(transcritpionId);
        if(!response){
            const error=new Error(`Sorry no transcription found with this transcription id : ${transcritpionId}`);
            error.status=404;
            throw error;
        }
        return response; // returning response to controller.
    }catch(error){
        console.log("sorry error occured in getSingleTranscriptionById in service layer : ",error);
        throw error; // throwing error back to controller.
    }
}