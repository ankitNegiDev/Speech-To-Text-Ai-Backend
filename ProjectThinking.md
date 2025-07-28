# How i am approaching this project

* first i am starting with backend once my backend is done then i can start with a simple ui that have upload audio functionality and show the text of uploaded audio that's it...

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
