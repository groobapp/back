import User from '../models/User.js'
import Publication from '../models/Publication.js'

export const bringAllPurchasesByUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const userPurchases = user?.purchases

        const postsPurchases = await Publication.find({
            _id: {
                $in: userPurchases
            }
        })
        console.log(postsPurchases)

        res.status(200).json(postsPurchases)
    } catch (error) {
        console.log(error)
        res.status(500).send('An internal server error occurred');
        next()
    }
}
