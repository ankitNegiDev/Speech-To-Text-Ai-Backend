// cloudinary configuration.
/**
 * here we are importing the version 2 of the official cloudinary Node.js sdk. and we use a alis as cloudinary instead of v2.. but -- on using version 2 we got error -- in multer-storage-cloudinary since it is built for version1 of cloudinary so we will do acc to clodinary version 1.
 * link to official docs : ===> https://cloudinary.com/documentation/node_integration
 */
// import { v2 as cloudinary } from 'cloudinary'; // this is for version 2
import cloudinary from 'cloudinary';


// now setting up sdk with our account details or we can say linking our account to cloudinary sdk.

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;



// frontend data-- > /// backend server  -- > - > coludinary () -> 