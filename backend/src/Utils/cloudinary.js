import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { resolve } from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, 
            {resource_type: "auto", transformation: {crop: "scale" }}
        );
        
        if(!response){
            console.log("Error uploading file on cloudinary : ", response)
            return null;
        }
        // console.log("File is uploaded on cloudinary : ", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });
        console.log("Image deleted successfully:", result);
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};

export { uploadOnCloudinary, deleteImage };
