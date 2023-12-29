import { Schema, model } from 'mongoose'

const walletSchema = new Schema({
    balance: {
        type: Number, require: true, trim: true, default: 100,
    },
    historyPurchases: [{
        date: { type: Date, default: new Date() },
        price: { type: Number },
        amount: { type: Number },
    }],
    coinsTransferred: [{
        amount: {
            type: Number, require: true
        },
        receiver: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: new Date()
        },
    }],
    coinsReceived: [{
        amount: {
            type: Number, require: true
        },
        sender: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: new Date()
        },
    }],
    mercadoPago: {
        email: { type: String, required: false, trim: true },
        CVU: {
            type: String, required: false, trim: true,
        },
        alias: {
            type: String, required: false, trim: true,
        },
    },
    payoneer: {
        email: { type: String, required: false, trim: true },
        ACH: {
            type: String, required: false, trim: true,
        },
        alias: {
            type: String, required: false, trim: true,
        },
    },
    crypto: {
        currency: { type: String, required: false, trim: true },
        address: { type: String, required: false, trim: true },
    },
    entity: {
        name: {
            type: String, required: false, trim: true, default: "Banco - Entidad"
        },
        CBU: {
            type: String, required: false, trim: true, default: "0000000000000000000000",
        },
        CVU: {
            type: String, required: false, trim: true, default: "0000000000000000000000",
        },
        alias: {
            type: String, required: true, trim: true, default: "gato.perro.loro",
        },
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

export default model('Wallet', walletSchema)