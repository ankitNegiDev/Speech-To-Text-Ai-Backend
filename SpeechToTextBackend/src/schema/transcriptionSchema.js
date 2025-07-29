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
    //! this is invalid since we are using clerk so we will get error in populate-
    // userId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'User',
    //     required:false // just becasue of guest user.
    // }
    userId: {
        type: String, // Clerk user ID
        required: false // just because of guest user.
    },

    // extra for edit functionality
    tags: {
        type: [String],
        default: []
    },
    reviewed: {
        type: Boolean,
        default: false
    },
    editHistory: [
        {
            previousText: String,
            editedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{timestamps:true});

// creating the Transcription collection using transcriptionSchema
export const Transcription = mongoose.model('Transcription', transcriptionSchema);