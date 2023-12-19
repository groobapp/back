import Publication from '../../models/Publication.js'
import User from "../../models/User.js";
import fs from "fs-extra"
import { uploadImage, deleteImage, uploadVideo, deleteVideo } from "../../libs/cloudinary.js";
import { closeConnectionInMongoose } from "../../libs/constants.js";
// import { CreatePublicationType, GetOrDeletePublicationByIdType } from '../schemas/publications.schema'

export const createPost = async (req, res, next) => {
    // comentario pa probar
    try {
        const { content, price, checkNSFW, checkExclusive } = req.body
        let priceValue;
        if (price) {
            priceValue = parseInt(price)
        }
        const user = await User.findById(req.userId, { password: 0 })
        if (!user) return res.status(404).json("No user found")
        const publication = new Publication({
            content,
            price: priceValue || 0,
            checkNSFW,
            checkExclusive,
            userIdCreatorPost: user?._id,
            userName: user?.userName,
            profilePicture: user?.profilePicture.secure_url,
            userVerified: user?.verified,
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
        const publicationSaved = await publication.save()
        const postIdForTheUser = publicationSaved?._id
        if (user != undefined) {
            user.publications = user.publications.concat(postIdForTheUser)
            await user.save()
        }
        res.status(201).json({ "success": true, publicationSaved })
        closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(next)
    }
}

export const uploadVideoPost = async (req, res, next) => {
    try {
        const { title, content, price, checkNSFW, checkExclusive } = req.body
        let priceValue;
        if (price) {
            priceValue = parseInt(price)
        }
        const user = await User.findById(req.userId, { password: 0 })
        if (!user) return res.status(404).json("No user found")
        const publication = new Publication({
            title,
            content,
            price: priceValue || 0,
            checkNSFW,
            checkExclusive,
            userIdCreatorPost: user?._id,
            userName: user?.userName,
            profilePicture: user?.profilePicture.secure_url,
            userVerified: user?.verified,
        })
        if (req.files) {
            const video = req.files['video']
            console.log("VIDEO FILE: ", video)
            const videoData = [];
            if (video) {
                const result = await uploadVideo({ filePath: video[0].path })
                videoData.push({ public_id: result.public_id, secure_url: result.secure_url })
                await fs.unlink(video[0].path)
            }
            publication.video = videoData
        }
        const publicationSaved = await publication.save()
        const postIdForTheUser = publicationSaved?._id
        if (user != undefined) {
            user.publications = user.publications.concat(postIdForTheUser)
            await user.save()
        }
        res.status(201).json({ "success": true, publicationSaved })
        closeConnectionInMongoose
    } catch (error) {
        console.log("hubo un error", error)
        res.status(400).json(error)
        next(next)
    }
}


export const getAllPostsByUserById = async (req, res, next) => {
    // Hacer paginado cada 7 posts así en el front se realiza infinity scroll
    try {
        const { id } = req.params
        if (!id) return

        const myUser = await User.findById(req.userId)
        if (!myUser) return

        const user = await User.findById(id)
        if (!user) return

        const userPosts = user.publications.map((id) => id)
        const searchPosts = await Publication.find({
            _id: {
                $in: userPosts
            }
        })
        const postsByUser = searchPosts.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        const filteredPosts = myUser.viewExplicitContent ?
            postsByUser :
            postsByUser.filter(post => !post.explicitContent || !post.checkNSFW);


        res.status(200).json(filteredPosts)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}

export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Publication.findById({ _id: id })
        res.status(200).json(post)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}


export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Publication.findById(id)
        if (!post) {
            return res.status(404).json({ message: "No se ha encontrado la publicación" })
        }
        const postInUser = await User.findById({ _id: req.userId })
        await Publication.deleteOne({ _id: id })
        if (post.images?.public_id) {
            await deleteImage(post.images.public_id)
        }
        if (post.video?.public_id) {
            await deleteVideo(post.video.public_id)
        }
        if (postInUser !== undefined) {
            postInUser.publications = postInUser.publications.filter(postId => id.toString() !== postId)
        }
        await postInUser.save()
        res.status(200).json(`Publicación eliminada`)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}

export const commentPost = async (req, res, next) => {
    try {
        const { value, id } = req.body
        const user = await User.findById(req.userId)
        const userName = user?.userName
        console.log(value, userName)
        if (value === undefined) res.status(400).json("El comentario no puede estar vacío")
        if (value.length > 500) res.status(400).json("El comentario no puede superar los 500 caracteres")
        const post = await Publication.findById({ _id: id })
        post.comments.push({ value, userName })
        const updatedPost = await Publication.findByIdAndUpdate(id, post, { new: true })
        res.status(200).json(updatedPost)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}

export const likePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Publication.findById({ _id: id })
        const user = await User.findById(req.userId)
        post.likes = post.likes + 1
        post.liked = post.liked.concat(user._id)
        await post.save()
        console.log(post.liked)
        console.log(post)
        res.status(200).json(post)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next({ error: error })
    }
}

export const dislikePost = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)

        const post = await Publication.findById({ _id: id })
        const user = req.userId
        const userId = user?._id
        post.likes = post.likes - 1
        post.liked = post.liked.filter(id => {
            id !== userId
        })
        await post.save()
        res.status(200).json(post.likes)
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}
