import { Schema, model } from 'mongoose'

const fiatSchema = new Schema({
    entity: {
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