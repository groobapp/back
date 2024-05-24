import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    members: {
        type: [String]
    },
    messages: [{
        sender: {
            senderId: {
                type: String,
                required: true
            },
            texts: [{
                text: {
                    type: String,
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }]
        },
        remitter: {
            remitterId: {
                type: String,
                required: false,
                trim: true
            },
            texts: [{
                text: {
                    type: String,
                    required: false
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }]
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, versionKey: false });

export default model('Chat', chatSchema);
