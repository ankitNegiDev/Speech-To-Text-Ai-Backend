// audio controller

import { deleteTranscriptionService, getSingleTranscriptionByIdService, getTranscriptionHistoryService, translateTranscriptionService, updateTranscriptionService, uploadAudioService } from "../services/audioService.js";

/**
 * see guest user can also upload the audio  and see the history -- if avialbe -- 
but how i will handel this -- if there are multiple user  so all user will see each other transcription if they use guest account ?? so i need to clean it every time also once the session is finished ?? 
and non-loged in user can also upload audio and see th transcription but we will not show them history --- history / upadte deelte all these will be done by loged in user 
 */

// (1) upload audio and store audio transcription into db.
export async function uploadAudio(req,res){
    try{
        console.log("inside the uplaod audio controller -- ");

        // all validation are applied even before request reach to controller.
        const audioUrl=req.file.path;
        // const userId=req.user?.id || null; // null is for guest user. //! this is bug -- clerkwithexpress will put userid in req.auth not in req.user
        const userId=req.auth?.userId || null;
        console.log("userid in controller is : ",userId);
        // console.log("req.user is : ",req.user);
        // console.log("req.auth is : ",req.auth);
        console.log("File received by backend:", req.file);
        // if req.user is undefined so acces undefined.id would thrwo error but ? optional chaning return the undefined and since we are using || or logical so short circurcited
        const transcription=await uploadAudioService(audioUrl,userId);
        return res.status(200).json({
            success: true,
            message: "Audio transcribed successfully",
            transcription,
            // audioData:audioUrl
        });
    }catch(error){
        console.log("error in upload audio in controller : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message: "Failed to process audio file." || error.message
        })
    }
}


// (2) get transcription by id

export async function getSingleTranscriptionById(req,res){
    try{
        const transcriptionId = req.params.id;
        console.log("transcription id in controller is : ",req.params.id);
        console.log("------------------- executing in history api");
        // if no transcription id exist then why to send request to service layer--
        /*
        * no need of this -- because a api endpoint with /api/audio/id will never hit until and unless we don't provide any id -- means if will be thre and either id is invalid or valid -- if id is invalid then repository throw erro and if id is valid but no transcritpion found -- then we got error acc to it and if we found trans the we got response acc to it.
        if (!transcriptionId) {
            return res.status(400).json({
                success: false,
                message: "Sorry transcription ID is required",
            });
        }*/

        const transcription = await getSingleTranscriptionByIdService(transcriptionId);
        return res.status(200).json({
            success:true,
            message:`conguratualations transcription with id : ${transcriptionId} fetched successfully`,
            data:{
                transcriptionData:transcription
            }
        });
    }catch(error){
        console.log("error occured in getSingleTranscription by id in controller : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Internal server error"
        });
    }
}


// (3) update transcription

/**
 * when a put request hit on -- > PUT /api/audio/:id then frontend will send this kind of request body.
    {
        "text": "Updated transcription text...",
        "tags": ["client", "meeting", "project"],
        "reviewed": true
    }

 */
export async function updateTranscriptionController(req,res){
    try{
        console.log("update request ");
        const transcriptionId=req.params.id;
        console.log("transcrpiton id is : ",transcriptionId);
        const userId = req.auth?.userId || null; // this userId will be given by clerk.
        console.log("userid in update is : ",userId);
        const updatePayload=req.body; // this is what frontend will send.
        console.log("update payload is : ",updatePayload);
        const updatedResponse = await updateTranscriptionService(transcriptionId,userId,updatePayload);
        return res.status(200).json({
            success:true,
            message:"Transcription updated successfully",
            data:updatedResponse
        });

    }catch(error){
        console.log("Error in updateTranscriptionController:", error);
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Internal server error"
        })
    }
}

// (4) delete transcription

export async function deleteTranscriptionController(req,res){
    try{
        console.log("deelte transcription request");
        const transcriptionId=req.params.id;
        const userId = req.auth?.userId // this userId will be given by clerk.
        console.log("user id is : ",userId);
        console.log("transcrpiton id is : ",transcriptionId);
        const deletedTranscription = await deleteTranscriptionService(transcriptionId,userId);

        return res.status(200).json({
            success:true,
            message: "Transcription deleted successfully",
            data: deletedTranscription
        });
    }catch(error){
        console.log("Error in deelteTranscriptionController:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        })
    }
}

// (5) getTranscriptionHistoryController

export async function getTranscriptionHistoryController(req,res){
    try{
        const userId = req.auth?.userId || null; // this userId will be given by clerk.
        console.log("userId in history controllr is : ",userId);
        // checking if userId is present or not..
        if (!userId) {
            const error = new Error("User ID is required to fetch history");
            error.status = 400;
            throw error;
        }
        const history = await getTranscriptionHistoryService (userId);
        console.log("history reposne from service is : ",history);

        // now here we need to check right -- since history will contain an array of object -- (each object is a transcription data) so if length is 0 then it means request-response cycle is done but there is no history yet for current user.

        if(history.length<=0){
            return res.status(200).json({
                success: true,
                message: "No transcription history yet.",
                data: [],
            })
        }
        // else -- send valid resoponse.
        return res.status(200).json({
            success:true,
            message: "Transcription history fetched successfully",
            data: history
        });

    }catch(error){
        console.log("Error in getTranscriptionHistoryController:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

// (6) translateTranscriptionController

export async function translateTranscriptionController(req,res){
    try{
        const transcriptionId=req.params.id;
        const {targetLanguage}=req.body;
        const userId = req.auth?.id || null; // this will be injected by clerk auth middle ware automatically.

        const translatedData = await translateTranscriptionService(transcriptionId, targetLanguage, userId);
        return res.status(200).json({
            success:true,
            message:"Translation successful",
            data:translatedData
        });
    }catch(error){
        console.error("Error in translateTranscriptionController:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}