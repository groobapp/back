import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Publication",
    },
    
    comment: {
        type: String,  maxlength: 500,
    },
    audio: {
        type: String,
    },
    userName: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
}, { timestamps: true, versionKey: false })

export default model('Comment', commentSchema)