// transcription schema
import mongoose from "mongoose"

const transcriptionSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
        trim:true
    },
    audioUrl:{
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false // just becasue of guest user.
    }
},{timestamps:true});

// creating the Transcription collection using transcriptionSchema
export const Transcription = mongoose.model('Transcription', transcriptionSchema);