import { Schema, model } from 'mongoose'

const favouriteSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Publication",
    },
    like: {
        type: String, required: false, trim: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamps: true, versionKey: false })

export default model('Favourite', favouriteSchema)