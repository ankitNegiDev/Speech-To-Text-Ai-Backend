// audio controller

import { uploadAudioService } from "../services/audioService.js";

/**
 * see guest user can also upload the audio  and see the history -- if avialbe -- 
but how i will handel this -- if there are multiple user  so all user will see each other transcription if they use guest account ?? so i need to clean it every time also once the session is finished ?? 
and non-loged in user can also upload audio and see th transcription but we will not show them history --- history / upadte deelte all these will be done by loged in user 
 */

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
            message: "Failed to process audio file."
        })
    }
}