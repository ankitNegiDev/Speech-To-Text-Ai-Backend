// service -- handel main logic

import { findTranscriptionByAudioUrl, getSingleTranscriptionByIdRepository, saveGuestTranscriptionTemp, saveTranscriptionToDB, updateTranscriptionRepository } from "../../repository/audioRepository.js";
import { speechToTextAPI } from "../utils/speechToText.js";

// (1) upload audio and save transcription to db
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

// (2) get single transcription by id 

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

// (3) edit/update transcription

export async function updateTranscriptionService(transcriptionId,userId,updatePayload){
    try{
        // first get the transcription -- using transcription id then only we will update that transcription
        const transcription=await getSingleTranscriptionByIdRepository(transcriptionId);
        if(!transcription){
            const error = new Error('Transcription not found');
            error.status=404;
            throw error;
        }

        // only owner can -- update the transcription -- this is kind of backend validation although in frontend we will protect our route so that any unauthorized user does not see update transcription option.. but if anyone that directly hit our api then we need handel that.
        if(transcription.userId && transcription.userId !== userId){
            const error = new Error("Unauthorized: You can only update your own transcription.");
            error.status=403;
            throw error;
        }
        const updatedResponse = await updateTranscriptionRepository(transcription,updatePayload);
        return updatedResponse;
    }catch(error){
        console.log("erorr occured in update transcription in service layer and error is : ",error);
        throw error; // throwing error to service.
    }
}