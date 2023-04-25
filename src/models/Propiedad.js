import { Schema, model } from 'mongoose'

const propiedadSchema = new Schema({
    titulo: { 
        type: String, required: true, trim: true 
    },
    descripcion: { 
        type: String, required: true, trim: true 
    },
    tipo: { // departamento, casa, lote, etc
        type: String, required: true, trim: true,
    },
    propósito: { // alquiler, venta, etc
        type: String, required: true, trim: true 
    },
    moneda: { 
        type: String, required: true, trim: true 
    },
    precio: {
        type: Number, required: true, trim: true, default: 0,
    },
    direccion: {
        type: String, required: false, trim: true,
    },
    localidad: {
        type: String, required: false, trim: true,
    },
    images: [{
        public_id: String,
        secure_url: String,
        required: false,
    }],
    baños: {
        type: Number, required: false, trim: true, default: 1,
    },
    dormitorios: {
        type: Number, required: false, trim: true, default: 0,
    },
    tamaño: {
        type: Number, required: false, trim: true,
    },
}, { timestamps: true, versionKey: false })

export default model('Propiedad', propiedadSchema)