// translation scheam -- so that we can do caching.

import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
    originalText: {
        type: String,
        required: true,
        trim: true
    },
    // targetlanguage
    targetLang: {
        type: String,
        required: true
    },
    translatedText: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: false // guest users allowed that's why its not true.
    }
}, { timestamps: true });

export const TranslationCache = mongoose.model("TranslationCache", translationSchema);
