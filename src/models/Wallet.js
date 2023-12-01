import { Schema, model } from 'mongoose'

const walletSchema = new Schema({
    mercadoPago: {
        email: { type: String, required: true, trim: true },
        CVU: {
            type: String, required: true, trim: true,
        },
        alias: {
            type: String, required: true, trim: true,
        },
    },
    payoneer: {
        email: { type: String, required: true, trim: true },
        ACH: {
            type: String, required: true, trim: true,
        },
        alias: {
            type: String, required: true, trim: true,
        },
    },
    crypto: {
        currency: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
    },
    entity: {
        name: {
            type: String, required: true, trim: true, default: "Banco - Entidad"
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

export default model('Fiat', walletSchema)