import User from '../../models/User.js';
import Publication from '../../models/Publication.js';


export const getAllPostsByFollowings = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(500).json("Usuario no loggeado")

        }
        const myUser = await User.findById(req.userId, {
            password: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0,
        })
        if (!myUser) {
            return res.status(500).json("No se ha encontrado un usuario")
        }
        const myPostsIds = myUser.publications.map((id) => id)
        const postsByMyUser = await Publication.find({
            _id: {
                $in: myPostsIds
            }
        })

        const myFollowingsIds = myUser.followings.map((id) => id)
        const postsByFollowings = await Publication.find({
            userIdCreatorPost: {
                $in: myFollowingsIds
            }
        })

        if (postsByFollowings.length > 0) {
            const allPosts = postsByMyUser.concat(postsByFollowings)
            const uniqueIds = [...new Set(allPosts.map(post => post._id.toString()))];
            const noDuplicates = uniqueIds.map(id => allPosts.find(post => post._id.toString() === id));
            const data = noDuplicates.sort((a, b) => b.createdAt - a.createdAt);
            return res.status(200).json(data)
        }

        const uniqueIds = [...new Set(postsByMyUser.map(post => post._id.toString()))];
        const noDuplicates = uniqueIds.map(id => postsByMyUser.find(post => post._id.toString() === id));
        const data = noDuplicates.sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(error)
    }
}