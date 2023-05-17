import Propiedad from '../../models/Propiedad.js'
import fs from "fs-extra"
import { uploadImage, deleteImage } from "../../libs/cloudinary.js";
import { closeConnectionInMongoose } from "../../libs/constants.js";
// import { CreatePublicationType, GetOrDeletePublicationByIdType } from '../schemas/publications.schema'

export const createPost = async (req, res, next) => {
    try {
        const { titulo, descripcion, proposito, moneda, tipo, direccion, localidad, tamano, precio, baños, dormitorios } = req.body;
        const precioNum = isNaN(parseInt(precio)) ? undefined : parseInt(precio);
        const bañosNum = isNaN(parseInt(baños)) ? undefined : parseInt(baños);
        const dormitoriosNum = isNaN(parseInt(dormitorios)) ? undefined : parseInt(dormitorios);
        const tamanoNum = isNaN(parseInt(tamano)) ? undefined : parseInt(tamano);
        const publication = new Propiedad({
            titulo,
            descripcion,
            proposito: proposito.toLowerCase(),
            moneda,
            direccion,
            precio: precioNum,
            baños: bañosNum,
            dormitorios: dormitoriosNum,
            tamaño: tamanoNum,
            tipo: tipo.toLowerCase(),
            localidad,
        })
        if (req.files) {
            const files = req.files['images']
            const data = []
            if (files) {
                for (const file of files) {
                    const result = await uploadImage({ filePath: file.path })
                    data.push({ public_id: result.public_id, secure_url: result.secure_url })
                    await fs.unlink(file.path)
                }
            }
            publication.images = data
        }
        const housePublicationCreated = await publication.save()
        res.status(200).json(housePublicationCreated)
        closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error})
        next()
    }
}

export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Propiedad.findById({ _id: id })
        res.status(200).json(post)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Propiedad.find()
        console.log(posts)
        res.status(200).json(posts)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}

export const updatePostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, proposito, moneda, tipo, direccion, localidad, images, precio, baños, dormitorios, tamaño } = req.body;

        const updatedPropiedad = await Propiedad.findByIdAndUpdate(id, {
            titulo,
            descripcion,
            proposito,
            precio,
            moneda,
            tipo,
            direccion,
            localidad,
            images,
            baños,
            dormitorios,
            tamaño
        }, { new: true });

        res.status(200).json(updatedPropiedad);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error });
        next(error);
    }
};


export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)
        const post = await Propiedad.findById(id)
        if (!post) {
            return res.status(404).json({ message: "No se ha encontrado la publicación" })
        }
        // tomar el public_id de la imagen y usar el método de cloudinary para eliminarla también
        const postImage = post.images
        await Propiedad.deleteOne({ _id: id })
        if (postImage) {
            for (const file of postImage) {
                await deleteImage({ public_id: file.public_id })
            }
        }
        
        res.status(200).json(`Publicación eliminada`)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}