import { Schema, model } from 'mongoose'

const mpAccountSchema = new Schema({
    access_token: {
        type: String
    },
    token_type: String,
    scope: String,
    user_id: {type: Number},
    refresh_token: {type: String},
    public_key: {type: String},
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, versionKey: false })

export default model('MpAccount', mpAccountSchema)