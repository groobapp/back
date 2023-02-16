import User from '../../models/User.js'
import Publication from '../../models/Publication.js'

export const bringAllPurchasesByUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const userPurchases = user?.purchases

        const findPostsPurchases = await Publication.find({
            _id: {
                $in: userPurchases
            }
        })

        const postsPurchases = findPostsPurchases.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(postsPurchases)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error});
        next(error)
    }
}
