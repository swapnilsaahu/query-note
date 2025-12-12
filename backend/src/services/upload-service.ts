import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';

export const uploadService = async (filePath: string): Promise<false | UploadApiResponse> => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    try {
        const result = await cloudinary.uploader.upload(filePath);
        console.log(result);
        return result;
    } catch (err) {
        console.error("error uploading to cloud", err);
        return false;
    }
}
