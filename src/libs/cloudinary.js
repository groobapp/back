import { v2 as cloudinary } from "cloudinary"
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: "dmdunpjti",
    api_key: "356936875512432",
    api_secret: "2orV4cVN0Lqmu5BPWY7PDuOkl4w",
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

export async function uploadVideo({ filePath }) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'uploads',
    })
}

export async function deleteVideo(publicId) {
    return await cloudinary.uploader.destroy(publicId)
}