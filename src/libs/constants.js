import mongoose from "mongoose";

export const closeConnectionInMongoose = mongoose.connection.close();