import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : "uploads",
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    }
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   })
  
export const upload = multer({ storage })