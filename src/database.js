import mongoose from "mongoose";
(async () => {
    try {
        const URI = process.env.NODE_ENV === "development"
            ? `mongodb://127.0.0.1:27017/${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
            : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error)
    }
})()
