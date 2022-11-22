import { Schema, model } from 'mongoose'

const publicationSchema = new Schema({
    content: {
        type: String, required: false, trim: true
    },
    images: [{
        public_id: String,
        secure_url: String, 
        required: false, 
    }],
    price: {
        type: Number, required: false, trim: true, default: 0,
    },
    likes: {
        type: Number, default: 0
    },
    liked: [String],
    explicitContent: { type: Boolean, default: false},
    buyers: {
        type: [String], default: []
    },
    comments: [{
        value: String,
        userName: String,
    }],
    createdAt: {
        type: Date,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    userVerified: {
        type: Boolean, default: false
    },
    buyers: {
        type: [String]
    },
    userName: {type: String},
    profilePicture: {type: String}
}, { timestamps: true, versionKey: false })

export default model('Publication', publicationSchema)