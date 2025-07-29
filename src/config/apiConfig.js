// importing dotenv

import dotenv from 'dotenv';

// reading all environment variable
dotenv.config();

console.log("assembly ai api key from env is : ",process.env.ASSEMBLYAI_API_KEY);
export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
