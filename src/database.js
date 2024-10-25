import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const M_USER = process.env.MONGO_USER
const M_PASSWORD = process.env.MONGO_PASSWORD
const M_CLUSTER = process.env.MONGO_CLUSTER
const M_DATABASE = process.env.MONGO_DATABASE

console.log("M_DATABASE:", M_DATABASE);

(async () => {
    const URI = `mongodb+srv://${M_USER}:${M_PASSWORD}@${M_CLUSTER}.mongodb.net/${M_DATABASE}?retryWrites=true&w=majority&authSource=admin`;
    try {
        const res = await mongoose.connect(URI);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
    }
})();

