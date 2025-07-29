// audio repository -- all db realted task will be done here..

import mongoose from "mongoose";
import { Transcription } from "../src/schema/transcriptionSchema.js";
import { TranslationCache } from "../src/schema/translationSchema.js";
const guestTranscriptions = [];
// this is for loged in user.
export async function saveTranscriptionToDB(userId,audioUrl,transcriptionText){
    try{
        const response = await Transcription.create({
            userId,
            audioUrl,
            text:transcriptionText
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
            const response=await Transcription.findOne({audioUrl,userId});
            return response;
        }else{
            const response=await Transcription.findOne({audioUrl,user:null});
            return response;
        }
    }catch(error){
        console.log("Repository: findTranscriptionByAudioUrl failed", error);
        throw error;
    }
}

//(2) get single transcription by id 

export async function getSingleTranscriptionByIdRepository(transcriptionId){
    try{
        // since transcription id will be created by mongoose so we need to validate it --
        if(!mongoose.Types.ObjectId.isValid(transcriptionId)){
            const error = new Error("Invalid transcription ID format");
            error.status=400;
            throw error;
        }
        const response=await Transcription.findById(transcriptionId);
        return response;
    }catch(error){
        console.log("error occur in getsingle transcription by id in repository layer : ",error);
        throw error; // throwing error to controller.
    }
}

// (3) updateTranscriptionRepository

export async function updateTranscriptionRepository(transcription,updatePayload){
    try{
        const { newText, newTags, reviewed }=updatePayload;
        if(newText && newText !== transcription.text){
            // it means user did some changes in text and we need to add the edit history.
            transcription.editHistory.push({
                previousText: transcription.text,
                editedAt: new Date()
            });
            // now updating the transcription text.
            transcription.text=newText;
        }

        // similary if newTags is array of tags then update it also 
        if (Array.isArray(newTags)) {
            transcription.tags = newTags;
        }

        // similary if user has reviewed and it is a boolean value then update it accordingly.
        if (typeof reviewed === "boolean") {
            transcription.reviewed = reviewed;
        }
        await transcription.save(); // saving the trasncription in db and returning it to service layer.
        return transcription;
    }catch(error){
        console.log("erorr occured in update trasncition in repository layer",error);
        throw error; // throwing error to service layer.
    }
}


// (4) deleteTranscriptionRepository 

export async function deleteTranscriptionRepository(transcriptionId){
    try{
        const deletedTranscription=await Transcription.findByIdAndDelete(transcriptionId);
        return deletedTranscription;
    }catch(error){
        console.log("Error in deleteTranscriptionRepository:", error);
        throw error; // throwing error back to service layer.
    }
}

//(5) getTranscriptionHistoryRepository

export async function getTranscriptionHistoryRepository(userId){
    try{
        const transcriptions = await Transcription.find({ userId }).sort({ createdAt: -1 }); // this will find first all the trasncription which has given userId and then sort based on createdAt measn latest transcription will be at top and so on -- oldest will be at bottom.
        return transcriptions;
    }catch(error){
        console.log("Error in getTranscriptionHistoryRepository:", error);
        throw error; // throwing error to sercive
    }
}

// (6) translation repositiory functions..

//(6 a) - checkTranslationCache -- here we will check is translated text present in db or not .

export async function checkTranslationCache(originalText,targetLang){
    try{
        const response = await TranslationCache.findOne({ originalText, targetLang });
        return response;
    }catch(error){
        console.log("erorr occured in check translation cache in repository : ",error);
        throw error; // throwing erro back to service latyer.
    }
}

// (6 b) - saveTranslationToCache -- here we will save the transalation into db for future caching.
export async function saveTranslationToCache(originalText, targetLang, translatedText, userId) {
    const newEntry = await TranslationCache.create({
        originalText,
        targetLang,
        translatedText,
        userId
    });
    return newEntry;
}