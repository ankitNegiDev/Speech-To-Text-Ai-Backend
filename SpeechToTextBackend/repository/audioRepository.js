// audio repository -- all db realted task will be done here..

import { Transcription } from "../src/schema/transcriptionSchema.js";
const guestTranscriptions = [];
// this is for loged in user.
export async function saveTranscriptionToDB(userId,audioUrl,transcriptionText){
    try{
        const response = await Transcription.create({
            user:userId,
            audioUrl,
            text
        });
        return response;
    }catch(error){
        console.log("error occur in saveTranscriptionToDB in repository : ",error);
        throw error; // throwing error to service layer.
    }
}

// for guest user -- saving in memory temporary -- 

export async function saveGuestTranscriptionTemp(audioUrl,text){
    const data={
        audioUrl,
        text
    };
    guestTranscriptions.push(data);

    // limiting the array or storage -- or array length 
    if(guestTranscriptions.length>10){
        guestTranscriptions.shift(); // remove earliest one. // then show it from first in last our (fifo form) on frontend
    }
    return data;
}

/**
 * what if user clidk button for transcribing audio into text multiple time -- we need make sure that if  transcription already exist -- then return it no need to create ? i guess something like -- 
see assume first time user send post request and again he send same so we don't do all these api call to transcribe same audio again ??
 */

// checking -- if transcription already exist or not -- may be this might happen right -- user upload the audio and then loged out -- again he upload the same audio then why we will convert that audio into text if we already have in db.

export async function findTranscriptionByAudioUrl(audioUrl,userId){
    try{
        if(userId){
            const response=await Transcription.findOne({audioUrl,user:userId});
            return response;
        }else{
            const response=await Transcription.findOne({audioUrl,user:null});
            return response;
        }
    }catch(error){
        console.error("Repository: findTranscriptionByAudioUrl failed", error);
        throw error;
    }
}