import dotenv from 'dotenv'
dotenv.config()
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const CLOUDINARY_API_ENVIROMENT = process.env.CLOUDINARY_API_ENVIROMENT

// No usado temporalmente
export const MONGO_DATABASE = process.env.MONGO_DATABASE
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const PORT = process.env.PORT
