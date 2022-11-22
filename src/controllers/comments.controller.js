import Publication from '../models/Publication.js'
import User from "../models/User.js";
import Comment from '../models/Comment.js';
import { closeConnectionInMongoose } from "../libs/constants.js";

export const commentPost = async (req, res, next) => {
    try {
        const { id } = req.params
        const { value } = req.body
        const user = await User.findById(req.userId)

        if (value === undefined) res.status(400).json("El comentario no puede estar vacío")
        if (value.length > 500) res.status(400).json("El comentario no puede superar los 500 caracteres")

        const comment = await new Comment({
            comment: value,
            
        })

        const post = await Publication.findById({ _id: id })
        post.comments.push(value)
        const updatedPost = await Publication.findByIdAndUpdate(id, post, { new: true })
        res.status(200).json(updatedPost)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error, message: 'Error occurred'});
        next()
    }
}