import mongoose from "mongoose";
(async () => {
        try {
    const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p7kqs.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
    await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    } );
} catch (error) {
    console.log(error)
}
})()
