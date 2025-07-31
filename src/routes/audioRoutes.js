// audio routes --
/**
 * assuming -- i will create all routes -- for showing all past transcription based on user (get) , user can add new transcription (post), user can update -title something (check for new audio), delete - for deelting any transcription (if anyone is deelted -- like transcrption or audio - both should be disapper from ui -- handel it)
 */

/**
POST /api/audio/upload — Upload & transcribe (guest + auth)

GET /api/audio/:id — Get a specific transcription

PUT /api/audio/:id — Update transcript (auth only)

DELETE /api/audio/:id —  Delete (auth only)

GET /api/audio/history —  Fetch user's history (auth only)

POST /api/audio/:id/translate —  Translate transcript

 */

import express from 'express';
import upload from '../middleware/multer.js';
import { validateAudioUpload } from '../validations/audioValidations.js';
import { deleteTranscriptionController, getSingleTranscriptionById, getTranscriptionHistoryController, translateTranscriptionController, updateTranscriptionController, uploadAudio } from '../controller/audioController.js';
import { generalLimiter, strictLimiter } from '../middleware/rateLimiter.js';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { multerErrorHandler } from '../middleware/multerErrorHandler.js';

const audioRouter=express.Router();

// upload the audio -- or recored audio will be also come in file format -- we will mae sure in frontend..
// to upload the audio 
audioRouter.post('/upload', ClerkExpressWithAuth(), upload.single('audio'), multerErrorHandler, validateAudioUpload,uploadAudio);

// audioRouter.post('/upload', upload.single('audio'), multerErrorHandler, validateAudioUpload, uploadAudio);

// to show all past audio and transcription
audioRouter.get('/history', ClerkExpressWithAuth(),getTranscriptionHistoryController); //! need to add clerk -- guest user is not allowed to see history..


// to get a specific transcritpion
audioRouter.get('/:id', generalLimiter, ClerkExpressWithAuth(),getSingleTranscriptionById);


// to update audio -- like title - check later needed or not
audioRouter.put('/:id',ClerkExpressWithAuth(),updateTranscriptionController); //! need to add clerk auth middlewware
//? example like this ===>  router.delete('/audio/:id', requireAuth(), deleteTranscriptionController);


// to delete the audio
audioRouter.delete('/:id',ClerkExpressWithAuth(),deleteTranscriptionController); //! need to add clerk auth middleware.. 


// to translate transcribed text -- 
audioRouter.post('/:id/translate',translateTranscriptionController) // no auth guest user can do this.




export default audioRouter;