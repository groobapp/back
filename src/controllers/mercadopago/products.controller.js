import User from '../models/User.js'
import Publication from '../models/Publication.js'

export const postsWithPriceByUserId = async (req, res, next) => {
    try {
        const {userId} = req.body
        const user = await User.findById({_id: userId})
        const publications = user?.publications

        
        const posts = await Publication.find({
            _id: {
                $in: publications
            }
        })

        const postsWithPrice = posts.filter(post => {
            if(post.price > 0) {
                return post
            }
        })
        console.log(postsWithPrice)
        res.status(200).json(postsWithPrice)
    } catch (error) {
        console.log(error)
        res.status(500).send('An internal server error occurred');
        next()
    }
}