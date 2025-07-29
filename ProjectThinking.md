# How i am approaching this project

* first i am starting with backend once my backend is done then i can start with a simple ui that have upload audio functionality and show the text of uploaded audio that's it...

    ```text
    Frontend
    │
    ├─ Record or upload the audio file
    │
    ├─  Using POST → /upload (FormData) sends the audio file to backend server
    │
    Backend (Express)
    │
    ├─ multer parses audio file → req.file
    │
    ├─ Send audio to Speech-to-Text API or if we want we can save audio to db.
    │
    ├─ Receive transcription from speech text api
    │
    ├─ Transcribe is saved to DB (speech is now converted to text)
    │
    └─ our sever then respond with transcription
    │
    Frontend
    ├─ Display transcription to user
    ├─ Show transcription history (optional)

    ```

* this is how overall flow will go.

## why multer is required and what is multer ?

* When the frontend uploads files (audio , video , images) it sends the data in a special format called multipart/form-data.
* When we are sending or Content-Type Headers Based on Payload( palyload is nothing but the data we are sending)
  * JSON then we use Content-Type: application/json
  * Simple form data (like name, email) then we use Content-Type: application/x-www-form-urlencoded
  * Files (like .mp3, .png, .pdf)  then we use  Content-Type: multipart/form-data.

* *When using FormData() in JavaScript (React, plain JS, etc.), the browser automatically sets Content-Type: multipart/form-data for us.*

* so multer is a middleware for express that handel mostly file upload like audio , video , images because when frontend sends these in form data then our backend server in express can't read it but using multer we can parse the incoming request and get the uploaded data or data that is being sent from the frontend and multer also adds file info to req.file (for single) or req.files (for multiple)

* Express doesn't understand multipart/form-data by default that's why express need multer or similar middleware.

## Backend

* starting with backend.

* ### `step 1 : create a simple server and test it for dummy route`

* ### `step 2 : now modify the above server and handel a file upload route`

* ### `step 3 : before doing any thing with the incoming post request data from frontend setup multer and parse the req.body to get file`

* ### `step 4 : once incoming request is parsed then send the audio to speech text api and store the transcribe response into the db and send this to frontend as a response`

---

## Backend Documentation

* now in backend we need `express , multer , cors , dotenv`
* `express :` is for creating server and define routes (/upload).
* `multer :` is for handeling and parsing file upload.Express can't read multipart/form-data directly so using multer we can parse file upload.
* `cors :` is for allowing request from the frontend.
* `dotenv :` to store the secret api's key and helps us manage environment variables like API keys, port numbers, and DB URIs securely.

* now to install all these write this command

    ```bash
    npm install express cors dotenv multer
    ```

* once it is done then setup a database on the mongodb atlas and setup a basic server and setup .env file.

* now i am doing one extra step here -- becaues i need to implement the authentication using clerk and also i want to show each user past transcription and i am planning to do like one guest user -- (a sample one that is loged in with default credientials which i will provide) and then i will put a check only loged in user can see past transcription and non-loged in user can see current one ---
* now keep in mind -- if we are showing the past transcription then a route will be need like /api/pastTranscription something like..

* now inorder - to upload audio file directly on cloud we need to use multer-storage-cloudinary npm package - multer-storage-cloudinary is a custom storage engine for multer that  Uploads files directly to Cloudinary No need to save to disk and upload manually.
* if we only use multer then it will store the file (audio) only in our local system but we want this audio is accessible via a link and also in production (or modern apps) we directly upload files to a cloud service like Cloudinary s3 — not save them locally first.
* If you only use multer then we would have to:
  * Store the file locally
  * Then manually upload it using Cloudinary's SDK
  * Then delete the local file to save space
* But with multer-storage-cloudinary: Everything is done in one step — file goes from frontend → multer → Cloudinary directly.

* ### Code without using multer-storage-cloudinary

  * Example without multer-storage-cloudinary

    ```js
    // First save the file locally
    const upload = multer({ dest: 'uploads/' }); // this line simply tells multer to save the file in the destination folder which is -- uploads here dest is short for destination.

    // here we are first parsing the incoming request using multer since content type is multi-part or form data so express can't handel it and for that we are using multer and since we know that multer also adds file info to req.file (for single) or req.files (for multiple) and then we are uploading it to the cloudinary.
    router.post('/upload', upload.single('audio'), async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "audio/video"
    });

    // Then you have to manually deleting the local file if we don't then there will be a time when our storage is filled completely and our server will be crashed.
    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url }); // this sends Cloudinary's secure URL for the uploaded audio file back to the frontend.
    });
    ```

* ### Code using multer-storage-cloudinary

  * if we use multer-storage-cloudinary then we can directly upload file to cloudinary instead of saving it to locally.

    ```js
    router.post('/upload', upload.single('audio'), (req, res) => {
    res.json({ url: req.file.path });
    });
    ```

* ### setting up multer middleware

  * now this is how we can setup multer middleware.

    ```js
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

    ```

---

* now creating the transcription schema -- and check it later -- if we are using clerk so do we need to create the schema for user or not ?

* now creating the routes - the api endpoint will be like -- http//:localhost/portNumber/api/upload -- for uploading audio and to get past transcription -- /api/history

* now the routes are created and our backend flow is like this -->

    ```bash
    Request → Router → Controller → Service → Repository → DB
    ```

---

* ## main logic to convert speech into text

  * now to convert speech into text we are using assmebly ai sppech to text api and the additional feature is - we will give a kind of dropdown to user to select in which language he want to see the text -- like user upload english audio and he want to see it in hindi then we will give this functionality.

  * so the flow will be like :

    ```bash
    Audio (English) → Transcription (English) → Translate → Show in Hindi/French/etc.
    ```

  * so to translate the transcribe text by assembly api we will use Google Translate API or LibreTranslate to translate text into that language which is choosed by user.
  * means -- at first user upload any audio in any language we will show transcribe text in english -- and then user will have a option to convert that text from english to any other langauge.

  * *Transcribe audio → (Always happens when user uploads audio)*

  * *Translate text → (Only happens when user selects a language)*

  * *So here we are technically calling two APIs but not at the same time. It's event-based and cleanly separated.*
  * now for this we can do one thing -- we have a post route /upload for audio upload or record and this api endpoint will return the transcribed text which is fine.
  * then we will create another route /translate or something that will reutrn the transcribed text in that langauge which is choosen by user that measn we need to send langauge info from the frontend to backend. and based on this selected langauge info we need to convert the transcribed text into that langauge using another api -- in backend.

  * now first we will focus on the how we can convert the speech to text - using assembly api sdk.
  * [official documentation of assembly ai api](https://www.assemblyai.com/products/speech-to-text)

    ---

* ### Steps to setup assembly ai api

  * #### step 1 : install assemblyai

    * first install the asseblyai using this command

        ```bash
        npm install assemblyai
        ```

  * #### step 2 : setup dotenv file

    * get the api key from the assemblyai website after signup store that api key in the dotenv file.

        ```env
        ASSEMBLYAI_API_KEY=your_actual_api_key_here
        ```

  * #### step 3 : load the environment variable

    * we can load the environment variable either in the server.js or in seprate file and then import it

        ```js
        import dotenv from 'dotenv';
        dotenv.config();
        export const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
        ```

  * #### step 4 : create a utility function using offical sdk

    * once all the step are done now we can use official assembly ai sdk.

        ```js
        // utils/speechToText.js

        import { AssemblyAI } from "assemblyai";

        // Create a client using your API key
        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY,
        });

        export async function speechToTextAPI(audioUrl) {
        try {
            const transcript = await client.transcripts.transcribe({
                audio: audioUrl,
                speech_model: "universal", // optional
            });

            return transcript.text;
        } catch (error) {
            console.error("AssemblyAI SDK Error:", error.message);
            throw new Error("Failed to transcribe audio");
        }
        }
        ```

    * first import the assembly ai then create a client

        ```js
        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY,
        });
        ```

    * this line create  a client instance that talks to assembly ai
    * api key is loaded from the .env file.
    * then create a function which we will use in service layer for converting audio to text functionality.

        ```js
        export async function speechToTextAPI(audioUrl) {
        try {
            const transcript = await client.transcripts.transcribe({
                audio: audioUrl,
                speech_model: "universal", 
            });

            return transcript.text;
        } catch (error) {
            console.error("AssemblyAI SDK Error:", error.message);
            throw new Error("Failed to transcribe audio");
        }
        }
        ```

    * now this function sppechToTextAPI accepts a parameter audioUrl → which should be a public link to the audio (from Cloudinary or somewhere else in cloud).
    * since the function is async in nature because calling an API is asynchronous task.

        ```js
        const transcript = await client.transcripts.transcribe({
            audio: audioUrl,
            speech_model: "universal"
        });
        ```

    * this line has the transcribed logic and if transcribed is successful then it return the response as transcribed text else it will throw error.

  * this is how we can setup the assembly ai api and convert our audio into text.

    ---

* after this we will create - controller -- (that will accept the request) and then send it to the service layer (which has logic - mainly to call our speechToTextAPI function) and then repository to save the transcribed text in db.
* *we did not have to store audio in db because its already saved in cloudinary*
* so overall flow will be like this- ---

    ```bash
    Request → Router → Controller → Service (logic to convert audio into text) → Repository (save the transcribed text into db) → DB
    ```

---

## Task left

* okey then -- what else is left -- in my project --
update , history , and translate and delete endpoints  and clerk middleware.

then i will do -- frontend -- integrate the clerk most imp for backend completion --
and then create  a frontend

---

* ## Edit transcription

  * now in edit transcription - we will give following features

    | Feature                        | Description                                                                                                                   |
    | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
    | **Edit Transcription Text** | The user can update the transcription text (e.g., fix errors or modify sentences).                                            |
    | **Add/Edit Tags**           | The user can attach tags (like `["meeting", "summary"]`) to organize their transcriptions.                                    |
    | **Mark as Reviewed**         | The user can toggle a `reviewed` flag (true/false) to indicate whether they’ve reviewed/finalized the transcription.          |
    | **Edit History**             | We store a version history of the `text` field. Each time the text is updated, we keep the previous version with a timestamp. |

---

* ## Deelete trasncription

  * now to delete trasncription first we need to get the transcription from db and then delete it.
