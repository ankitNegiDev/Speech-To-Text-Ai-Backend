// creating a basic dummy server

import express from 'express';
import { PORT } from './config/serverConfig.js';
import { connectDb } from './config/dbConfig.js';
import cors from 'cors';
import apiRouter from './routes/apiRoutes.js';

// import dotenv from 'dotenv';
// dotenv.config();



const app=express();

// Using cors

app.use(cors({
    origin: [
        "http://localhost:5173", "http://127.0.0.1:5500", "https://speech-to-text-ai-frontend.vercel.app"
    ],
    credentials: true
}));

// Inbuilt middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));


// // Using cors

// app.use(cors({
//     origin:[
//         "http://localhost:5173", "http://127.0.0.1:5500","https://speech-to-text-ai-frontend.vercel.app/"
//     ],
//     credentials: true
// }));

app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.path}`);
    next();
});

app.use('/api',apiRouter);

app.listen(PORT,function callback(){
    console.log("Server is listening on port : ",PORT);
    // calling connectDb() function to connect with database
    connectDb();
});

app.get('/ping',function callback(req,res){
    console.log("request ping to server sucessfully");
    return res.send("<h1>hii request is pinged successfully on server </h1>");
});

app.get('/', function callback (req, res) {
    res.json({
        message: "🎙️ Welcome to the Speech to Text AI Backend!",
        status: "Running Smoothly",
        docs: {
            audioRoutes: "/api/audio",
            getHistory: "/api/audio/history",
            uploadAudio: "/api/audio/upload",
            getSingleTranscription: "/api/audio/:id",
            translate: "/api/audio/:id/translate"
        },
        note: "Visit the frontend here: https://speech-to-text-ai-frontend.vercel.app"
    });
});





