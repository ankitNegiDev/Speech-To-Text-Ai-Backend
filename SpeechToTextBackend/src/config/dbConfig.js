// db configuration

// importing mongoose from mongoose
import mongoose from 'mongoose';
import { MONGODB_URL } from './serverConfig.js';

export async function connectDb(){
    try{
        await mongoose.connect(MONGODB_URL);
        console.log("connection is setup with mongodb databse\n");
    }catch(error){
        console.log("sorry failed to connect with mongodb");
        console.log("error : ",error);
    }
}
