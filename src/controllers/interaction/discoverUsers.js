import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
// import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js';
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const discoverPostsWithImages = async (req, res, next) => {
    try {
        const allPublications = await Publication.find()
        // if (user.explicitContent === true) {
        res.status(200).json(allPublications)

        // const filterByExplicitContentAndImages = allPublications.filter(post => {
        //     if (post.explicitContent === false
        //         && post.images.length > 0
        //         && post.price === 0) {
        //         return post;
        //     }
        // })
        // const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
        //     if (a.createdAt < b.createdAt) return 1;
        //     return -1;
        // })


        // const replyFromCache = await GET_REDIS_ASYNC("discoverPostsWithImages")
        // if (replyFromCache) {
        //     return res.json(JSON.parse(replyFromCache))
        // }
        // else {
        // const response = await SET_REDIS_ASYNC('discoverPostsWithImages', JSON.stringify(data))
        // console.log("almacenado en caché con redis", response)
        // res.status(200).json(orderByDate)
        // }

        // } else if (user.explicitContent === false) {
        //     const filterByPhoto = allPublications.filter(post => {
        //         if (post.explicitContent === false
        //             && post.images.length > 0
        //             && post.price === 0) {
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

        // const replyFromCache = await GET_REDIS_ASYNC("discoverPostsWithImages")
        // if (replyFromCache) {
        //     return res.json(JSON.parse(replyFromCache))
        // }
        // else {
        // const response = await SET_REDIS_ASYNC('discoverPostsWithImages', JSON.stringify(data))
        // console.log("almacenado en caché con redis", response)
        // res.status(200).json(data)
        // }
        // }
        return closeConnectionInMongoose;
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}


export const discoverPostsWithTexts = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const allPublications = await Publication.find()
        const texts = allPublications.filter(post => {
            if (post.content.length > 0
                && post.price === 0 && post.images.length === 0) {
                return post;
            }
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
