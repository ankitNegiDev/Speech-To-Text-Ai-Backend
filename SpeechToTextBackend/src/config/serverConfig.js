// Basic server configuration

// importing dotenv
import dotenv from 'dotenv';

// loading all environment variables .
dotenv.config();

console.log("PORT from env is : ",process.env.PORT);
export const PORT=process.env.PORT;

console.log("mogo url from the env is : ",process.env.MONGODB_URL);
export const MONGODB_URL=process.env.MONGODB_URL;