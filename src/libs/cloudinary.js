import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config()
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} from "../config.js"

cloudinary.config({
    cloud_name: "groob",
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
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