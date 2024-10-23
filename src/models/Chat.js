import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    members: {
        type: [String]
    },
   messages: [{
    senderId: {
        type: String,
        required: true
    },
    remitterId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
}, { _id: false }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, versionKey: false });

export default model('Chat', chatSchema);
