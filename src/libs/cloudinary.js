import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config()
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from "../config.js"

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: "17C_wVZf2cpw7lVydqBDGULuHeU",
    secure: true,
})

export async function uploadImage({ filePath }) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'uploads'
    })
}

export async function deleteImage(publicId) {
    return await cloudinary.uploader.destroy(publicId)
}