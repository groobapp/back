import { Schema, model } from 'mongoose'

const propiedadSchema = new Schema({
    titulo: {type: String, required: true, trim: true},
    direccion: {
        type: String, required: false, trim: true,
    },
    localidad: {
        type: String, required: false, trim: true,
    },
    tipo: {
        type: String, required: false, trim: true,
    },
    images: [{
        public_id: String,
        secure_url: String, 
        required: false, 
    }],
    precio: {
        type: Number, required: false, trim: true, default: 0,
    },
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