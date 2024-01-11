import User from '../../models/User.js';
import Publication from '../../models/Publication.js';

// export const getAllPostsByFollowings = async (req, res, next) => {
//     try {
//         if (!req.userId) {
//             res.status(500).send("Usuario no loggeado")
//             return
//         }
//         const myUser = await User.findById(req.userId, {
//             password: 0,
//             mpAccessToken: 0,
//             followers: 0,
//             role: 0,
//             firstName: 0,
//             lastName: 0,
//             createdAt: 0,
//             visits: 0,
//             updatedAt: 0,
//             phone: 0,
//             verificationInProcess: 0,
//             verificationPay: 0,
//             purchases: 0,
//             chats: 0,
//             notifications: 0
//         }).populate({
//             path: 'publications',
//             select: 'publications',
//         })

//         const myPostsIds = myUser.publications.map(pub => pub._id);
//         const postsByMyUser = await Publication.find({ _id: { $in: myPostsIds } });

//         const followingsIds = myUser.followings.map(followings => followings);
//         const postsByFollowings = await Publication.find({ user: { $in: followingsIds } });

//         if (postsByFollowings.length || postsByMyUser.length) {
//             const allPosts = postsByMyUser.concat(postsByFollowings)

//             const uniquePostsSet = new Set(allPosts.map(post => post._id.toString()));
//             const uniquePostsArray = [...uniquePostsSet].map(id =>
//                 allPosts.find(post => post._id.toString() === id)
//             );

//             const sortedUniquePosts = uniquePostsArray.sort((a, b) => {
//                 if (a.createdAt < b.createdAt) return 1;
//                 return -1;
//             });

//             const filteredPosts = myUser.viewExplicitContent ?
//                 sortedUniquePosts :
//                 sortedUniquePosts.filter(post => !post.explicitContent || !post.checkNSFW);
//             console.log("POSTS DE QUIENES SIGO", filteredPosts)
//             res.status(200).json(filteredPosts);
//         } else {
//             res.status(200).json([]);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(400).json(error);
//         next(error);
//     }
// }

export const getAllPostsByFollowings = async (req, res, next) => {
    try {
        if (!req.userId) {
            res.status(500).json("Usuario no loggeado")
            return
        }
        const myUser = await User.findById(req.userId, {
            password: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
        })
        let myPosts = myUser.publications.map((id) => id)
        const postsByMyUser = await Publication.find({
            _id: {
                $in: myPosts
            }
        })

        let allMyIds = myUser.followings.map((id) => id)
        const postsByFollowings = await Publication.find({
            user: {
                $in: allMyIds
            }
        })
        const allPosts = postsByMyUser.concat(postsByFollowings)
        console.log("allPosts: ", allPosts)
        const noDuplicates = [...new Set(allPosts.map(post => post._id))] // elimino posibles resultados duplicados
            .map(id => allPosts.find(post => post._id === id));

        const data = noDuplicates.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })
        res.status(200).json(data)


    } catch (error) {
        console.log(error)
        res.status(400).json(error)
        next(error)
    }
}