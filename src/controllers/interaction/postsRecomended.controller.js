import Publication from '../../models/Publication.js'

// import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js';

export const postsRecomended = async (_req, res, next) => {
    try {
        //   const replyFromCache = await GET_REDIS_ASYNC("getPostsRecomended")
        //   if (replyFromCache) {
        //       console.log("no duplicados desde cache")
        //       return res.json(replyFromCache)  
        //   } else {

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
        const noDuplicates = [...new Set(filterByPhoto.map(post => post._id))]
            .map(id => filterByPhoto.find(post => post._id === id));
        // await SET_REDIS_ASYNC('getPostsRecomended', noDuplicates)
        return res.status(200).json(noDuplicates)
        // } 
    } catch (error) {
        console.log(error)
        res.status(500).json({ "message": error })
        next(error)
    }
}