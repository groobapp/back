import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: "groob",
    api_key: "212115414392645",
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