import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
    chatId: {
        // type: Schema.Types.ObjectId,
        // ref: "Chat",
        type: String, required: false, trim: true
    },
    senderId: {type: String},
    remitterId: {
        type: String, required: false, trim: true
    },
    text: { type: String },
}, { timestamps: true, versionKey: false, })

export default model('Message', messageSchema)