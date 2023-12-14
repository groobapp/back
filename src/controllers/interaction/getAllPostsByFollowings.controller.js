import User from '../../models/User.js'
import Publication from "../../models/Publication.js";
// import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js';
import { closeConnectionInMongoose } from "../../libs/constants.js";

export const getAllPostsByFollowings = async (req, res, next) => {
    try {

        const myUser = await User.findById(req.userId, {
            password: 0,
            mpAccessToken: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
        })
        // traigo mi usuario y busco los id de mis publicaciones
        let myPosts = myUser.publications.map((id) => id)
        // busco mis publicaciones en el modelo
        const postsByMyUser = await Publication.find({
            _id: {
                $in: myPosts
            }
        })

        let allMyIds = myUser.followings.map((id) => id)
        // busco las publicaciones de quienes sigo
        const postsByFollowings = await Publication.find({
            user: {
                $in: allMyIds
            }
        })
        // No implementado
        let usersByPosts = await User.find({
            user: {
                $in: allMyIds
            }
        }, {
            password: 0,
            mpAccessToken: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
        })
        // Implementar en unir cada post con los datos del usuario correspondiente
        if (postsByFollowings.length === 0) {
            const data = postsByMyUser.concat(postsByFollowings)
            return res.status(200).json(data)
        }
        else if (postsByFollowings.length > 0 || postsByMyUser.length > 0) {

            if (myUser.explicitContent === true || myUser.checkNSFW === true) {
                const allPosts = postsByMyUser.concat(postsByFollowings) // concateno los usuarios y los posts
                const noDuplicates = [...new Set(allPosts.map(post => post._id))] // elimino posibles resultados duplicados
                    .map(id => allPosts.find(post => post._id === id));
                const data = noDuplicates.sort((a, b) => {
                    if (a.createdAt < b.createdAt) return 1; // ordeno por fecha más reciente 
                    return -1;
                })
                data,
                    // const replyFromCache = await GET_REDIS_ASYNC("getPostsByFollowings")
                    // if (replyFromCache) {
                    //     return res.json(JSON.parse(replyFromCache))
                    // }
                    // else {
                    // const response = await SET_REDIS_ASYNC('getPostsByFollowings', JSON.stringify(getPostsByFollowings))
                    res.status(200).json(data)
                // }
            } else {
                const postWithOutExplicitContent = postsByFollowings.filter(post => {
                    return post.explicitContent === false
                })
                const allPosts = postsByMyUser.concat(postWithOutExplicitContent) // concateno los usuarios y los posts
                const noDuplicates = [...new Set(allPosts.map(post => post._id))]
                    .map(id => allPosts.find(post => post._id === id)); // elimino posibles resultados duplicados
                const data = noDuplicates.sort((a, b) => {
                    if (a.createdAt < b.createdAt) return 1; // ordeno por fecha más reciente 
                    return -1;
                })
                data,
                    // const replyFromCache = await GET_REDIS_ASYNC("getPostsByFollowings")
                    // if (replyFromCache) {
                    //     return res.json(JSON.parse(replyFromCache))
                    // }
                    // else {
                    // const response = await SET_REDIS_ASYNC('getPostsByFollowings', JSON.stringify(getPostsByFollowings))
                    res.status(200).json(data)
                // }

            }
        }
        closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(error)
    }
}

