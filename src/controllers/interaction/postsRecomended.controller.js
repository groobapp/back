import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
import { closeConnectionInMongoose } from '../../libs/constants.js'
import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js'

export const postsRecomended = async (req, res, next) => {
    try {

        const allPublications = await Publication.find()
        const filterByPhoto = allPublications.filter(post => {
                if (post.images.length > 0) {
                    return post;
                }
            }).sort((a, b) => {
                if (a.likes < b.likes) return 1;
                return -1;
            }).sort((a, b) => {
                if (a.userVerified < b.userVerified) return 1;
                return -1;
            })

        // Evitar publicaciones repetidas
        const noDuplicates = [...new Set(filterByPhoto.map(post => post._id))]
        .map(id => filterByPhoto.find(post => post._id === id));

        // Añadir un filtro aleatorio que traiga de a 30 publicaciones?
        // Añadir un filtro que traiga de a 500 publicaciones y mo

        const replyFromCache = await GET_REDIS_ASYNC("getPostsRecomended")
        if (replyFromCache) {
            return res.json(JSON.parse(replyFromCache))
        }
        else {
            const response = await SET_REDIS_ASYNC('getPostsRecomended', JSON.stringify(noDuplicates))
            console.log("almacenado en caché con redis", response)
            res.status(200).json(noDuplicates)
        }
        return closeConnectionInMongoose;
    } catch (error) {
        console.log(error)
        next()
    }
}