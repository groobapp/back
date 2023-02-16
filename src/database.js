import mongoose from "mongoose";
(async () => {
    try {
        const URI = process.env.NODE_ENV !== "development" 
        ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p7kqs.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true` 
        : `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p7kqs.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.log(error)
    }
})()

// import mongoose from "mongoose";

// (async () => {
//   try {
//     let URI;
//     if (process.env.NODE_ENV === "development") {
//       URI = `mongodb://localhost:27017/${process.env.LOCAL_MONGO_DATABASE}`;
//     } else {
//       URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p7kqs.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;
//     }

//     await mongoose.connect(URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//   } catch (error) {
//     console.error(error);
//   }
// })();