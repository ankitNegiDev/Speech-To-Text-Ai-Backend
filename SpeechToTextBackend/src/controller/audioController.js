// audio controller

import { getSingleTranscriptionByIdService, updateTranscriptionService, uploadAudioService } from "../services/audioService.js";

/**
 * see guest user can also upload the audio  and see the history -- if avialbe -- 
but how i will handel this -- if there are multiple user  so all user will see each other transcription if they use guest account ?? so i need to clean it every time also once the session is finished ?? 
and non-loged in user can also upload audio and see th transcription but we will not show them history --- history / upadte deelte all these will be done by loged in user 
 */

// (1) upload audio and store audio transcription into db.
export async function uploadAudio(req,res){
    try{

        // all validation are applied even before request reach to controller.
        const audioUrl=req.file.path;
        const userId=req.user?.id || null; // null is for guest user.
        // if req.user is undefined so acces undefined.id would thrwo error but ? optional chaning return the undefined and since we are using || or logical so short circurcited
        const transcription=await uploadAudioService(audioUrl,userId);
        return res.status(200).json({
            success: true,
            message: "Audio transcribed successfully",
            transcription,
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
        const transcriptionId=req.params.id;
        const userId = req.user?.id || null; // this userId will be given by clerk.
        const updatePayload=req.body; // this is what frontend will send.
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