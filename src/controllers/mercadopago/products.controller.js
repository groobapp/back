import User from '../../models/User.js'
import Publication from '../../models/Publication.js'
import { closeConnectionInMongoose } from '../../libs/constants.js'

export const postsWithPriceByUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const publications = user?.publications
        const posts = await Publication.find({
            _id: {
                $in: publications
            }
        })
        const postsWithPrice = posts.filter(post => {
            if (post.price > 0) {
                return post
            }
        })

        res.status(200).json(postsWithPrice)
        return closeConnectionInMongoose;
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}



export const postsWithPriceByUserId = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id, { password: 0, purchases: 0, mpAccount: 0, mpAccessToken: 0, verificationPay: 0, verificationInProcess: 0 })

        const publications = user?.publications


        const posts = await Publication.find({
            _id: {
                $in: publications
            }
        })

        const postsWithPrice = posts.filter(post => {
            if (post.price > 0) {
                return post
            }
        })
        // const replyFromCache = await GET_REDIS_ASYNC("postsWithPriceByUser")
        // if (replyFromCache) {
        //     return res.json(JSON.parse(replyFromCache))
        // }
        // else {
        //     const response = await SET_REDIS_ASYNC('postsWithPriceByUser', JSON.stringify(postsWithPrice))
        //     console.log("almacenado en caché con redis", response)
        res.status(200).json(postsWithPrice)
        // }
        return closeConnectionInMongoose;
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}
