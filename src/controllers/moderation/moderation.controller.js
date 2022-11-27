import User from '../../models/User.js'
import Publication from '../../models/Publication.js'

export const denouncePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Publication.findById({ _id: id })
        const user = await User.findById(req.userId)
        post.denouncement = post.denouncement.concat(user._id)
        await post.save()
        console.log("post denunciado")
        res.status(200).json("post denunciado")
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
        next()
    }
}
