// importing multer
import multer from 'multer';

// importing CloudinaryStorage class from multer-storage-cloduinary package..
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// importing cloudinary
import cloudinary from '../config/cloudinaryConfig.js';

// creating a storage unit
const storage = new CloudinaryStorage({
    cloudinary, // this is our credientials
    // this params object will tell how a upload will be handeled by cloudinary
    params: {
        folder: 'audio-transcriptions', // folder name 
        resource_type: 'video', // for audio uploads in Cloudinary and  resource_type :'raw' for zip,pdf etc..
        public_id: (req, file) => `audio-${Date.now()}`
    }
});

// checking for file types -- any invalid file type upload will not be allowed
// MIME type (Multipurpose Internet Mail Extensions) tells what type of file is being uploaded.
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed!'), false);
    }
};

// setting upload limit to prevent exhaustation of my free tier.
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB audio is allowed to upload on cloudinary..
});

export default upload;
