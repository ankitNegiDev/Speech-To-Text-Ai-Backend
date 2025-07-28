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
