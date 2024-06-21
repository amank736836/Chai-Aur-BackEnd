import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            throw new Error("No File Path Provided");
        }
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
            resource_type: "auto",
            // folder: "videoTube"
            },
            // (error, result) => {
            //     if(error){
            //         throw new Error(error);
            //     }
            //     return result;
            // }
        );
        // file has been uploaded successfully on cloudinary
        // console.log("File is uploaded on cloudinary" , response.url);
        // console.log(response);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return response;
    }
    catch(error){
        // console.log(error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};