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
import { getSingleTranscriptionById, uploadAudio } from '../controller/audioController.js';

const audioRouter=express.Router();

// upload the audio -- or recored audio will be also come in file format -- we will mae sure in frontend..
// to upload the audio 
audioRouter.post('/upload',upload.single('audio'), validateAudioUpload,uploadAudio);

// to get a specific transcritpion
// audioRouter.get('/:id',getSingleTranscriptionById);

// to show all past audio and transcription
// audioRouter.get('/history');

// to update audio -- like title - check later needed or not
// audioRouter.put('/:id');

// to delete the audio 
// audioRouter.delete('/:id');

export default audioRouter;