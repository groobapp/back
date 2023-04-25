import Propiedad from '../../models/Propiedad.js'
import { closeConnectionInMongoose } from "../../libs/constants.js";
// import { CreatePublicationType, GetOrDeletePublicationByIdType } from '../schemas/publications.schema'

export const filtroPorTipo = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Propiedad.findById({ _id: id })
        res.status(200).json(post)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(400).send("Mandaste cualquier cosa amigo")
        next()
    }
}

export const FiltroPorCaracteristica = async (req, res, next) => {
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

export const FiltroPorPrecio = async (req, res, next) => {
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
