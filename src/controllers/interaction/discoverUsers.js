import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const discoverPostsWithImages = async (req, res, next) => {
    try {
        const allPublications = await Publication.find({}, {
            title: 0,
            videos: 0,
            content: 0,
            likes: 0,
            liked: 0,
            buyers: 0,
            comments: 0,
            denouncement: 0,
        })

        const filterByExplicitContentAndImages = allPublications.filter(post => {
            if (post.images.length > 0 && post.images[0].secure_url !== undefined
                && post.price === 0) {
                return post;
            }
        })
        const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(orderByDate)

        return closeConnectionInMongoose;
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}


export const discoverPostsWithTexts = async (req, res, next) => {
    try {
        const allPublications = await Publication.find()
        const data = allPublications.filter(post => {
            if (post.content.length > 0 && post.price === 0 && !post.images) {
                return post;
            }
        })
        const texts = data.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(texts)
        // if (user.explicitContent === true) {
        //     const filterByExplicitContentAndTexts = allPublications.filter(post => {
        //         if (post.explicitContent === false
        //             || post.explicitContent === true
        //             && post.content.length > 0
        //             && post.price === 0 && post.images.length === 0) {
        //             return post;
        //         }
        //     })
        //     const orderByDate = filterByExplicitContentAndTexts.sort((a, b) => {
        //         if (a.createdAt < b.createdAt) return 1;
        //         return -1;
        //     })

        //     const data = {
        //         orderByDate,
        //         mpAccountAsociated: user?.mpAccountAsociated
        //     }
        //     const replyFromCache = await GET_REDIS_ASYNC("discoverPostsWithTexts")
        //     if (replyFromCache) {
        //         return res.json(JSON.parse(replyFromCache))
        //     }
        //     else {
        //         const response = await SET_REDIS_ASYNC('discoverPostsWithTexts', JSON.stringify(data))
        //         console.log("almacenado en caché con redis", response)
        //         res.status(200).json(data)
        //     }

        // } else if (user.explicitContent === false) {
        //     const filterByPhoto = allPublications.filter(post => {
        //         if (post.explicitContent === false
        //             && post.content.length > 0
        //             && post.price === 0 && post.images.length === 0) {
        //             return post
        //         }
        //     })
        //     const orderByDate = filterByPhoto.sort((a, b) => {
        //         if (a.createdAt < b.createdAt) return 1;
        //         return -1;
        //     })
        //     const data = {
        //         orderByDate,
        //         mpAccountAsociated: user?.mpAccountAsociated
        //     }

        //     const replyFromCache = await GET_REDIS_ASYNC("discoverPostsWithTexts")
        //     if (replyFromCache) {
        //         return res.json(JSON.parse(replyFromCache))
        //     }
        //     else {
        //         const response = await SET_REDIS_ASYNC('discoverPostsWithTexts', JSON.stringify(data))
        //         console.log("almacenado en caché con redis", response)
        //         res.status(200).json(data)
        //     }
        // }
        // return closeConnectionInMongoose;
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(error)
    }
}
