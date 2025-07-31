// all validations regarding to file are written seprately to keep code modular and redable.

export async function validateAudioUpload(req,res,next){
    console.log("validating the audio upload that we get from frontend ");
    const file=req.file; // the audio that is uploded or recored by user and multer will add all info into the req object -- that's why we are accessing req.file

    // checking file exist or not in req object -- neither user upload or nor any file exist in request object means  sometiems it might be possible that req.file exist but req.file.path is null or undefined becasue multer failed
    if(!file || !file.path){
        return res.status(400).json({
            success:false,
            error: "No valid audio file uploaded."
        })
    }

    // once the validation is passed we can call next() function -- which can be another middleware or our controller function
    next();
}