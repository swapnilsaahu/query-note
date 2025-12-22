import { v2 as cloudinary } from 'cloudinary';

export const uploadService = async (filePath: string) => {
    const result = await cloudinary.uploader.upload(filePath);
    console.log(result);
    return result;
}
