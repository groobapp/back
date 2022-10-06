import { Schema, model } from 'mongoose'

const fiatSchema = new Schema({
    Coin: {
        type: String, required: false, trim: true, default: "USDT",
    },
    Red: { 
        type: String, required: false, trim: true, default: "Binance Smart Chain",
    },
    Address: {
        type: String, required: true, trim: true, default: "00xRTX3090dBZ07snk5CpUxRGBx00",
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true, versionKey: false })

export default model('Fiat', fiatSchema)