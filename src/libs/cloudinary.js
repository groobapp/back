import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({ 
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
  api_key: `${process.env.CLOUDINARY_API_KEY}`, 
  api_secret: `${CLOUDINARY_API_SECRET}`,
});

export async function uploadImage({ filePath }) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'uploads'
    })
}

export async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId)
}

export async function uploadVideo({ filePath }) {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: 'uploads',
    })
}

export async function deleteVideo(publicId) {
    return await cloudinary.uploader.destroy(publicId)
}