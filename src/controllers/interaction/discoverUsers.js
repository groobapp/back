import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const discoverUsers = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const allPublications = await Publication.find()
        if (user.explicitContent === true) {
            const filterByExplicitContentAndImages = allPublications.filter(post => {
                if (post => post.explicitContent === false
                    || post.explicitContent === true
                    && post.images.length > 0
                    && post.price === 0) {
                    return post;
                }
            })
            const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
                if (a.createdAt < b.createdAt) return 1;
                return -1;
            })
            res.status(200).json({ orderByDate, mpAccountAsociated: user?.mpAccountAsociated })

        } else if (user.explicitContent === false) {
            const filterByPhoto = allPublications.filter(post => {
                if (post.explicitContent === false
                    && post.images.length > 0
                    && post.price === 0) {
                    return post
                }
            })
            const orderByDate = filterByPhoto.sort((a, b) => {
                if (a.createdAt < b.createdAt) return 1;
                return -1;
            })
            res.status(200).json({ orderByDate, mpAccountAsociated: user?.mpAccountAsociated })
        }
        return closeConnectionInMongoose;
    } catch (error) {
        console.log(error)
        next()
    }
}
