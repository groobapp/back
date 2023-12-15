import User from '../../models/User.js';
import Publication from '../../models/Publication.js';

export const getAllPostsByFollowings = async (req, res, next) => {
    try {
        const myUser = await User.findById(req.userId, {
            password: 0,
            mpAccessToken: 0,
            followers: 0,
            role: 0,
            firstName: 0,
            lastName: 0,
            createdAt: 0,
            visits: 0,
            updatedAt: 0,
            phone: 0,
            verificationInProcess: 0,
            verificationPay: 0,
            purchases: 0,
            chats: 0,
            notifications: 0
        }).populate({
            path: 'publications',
            select: 'publications',
        }).populate({
            path: 'followings',
            select: 'followings',
        })
        if (!myUser) {
            res.status(500).send("Usuario no loggeado")
            return
        }

        const myPosts = myUser.publications.map(pub => pub._id);
        const postsByMyUser = await Publication.find({ _id: { $in: myPosts } });

        const followingsIds = myUser.followings.map(followings => followings);
        const postsByFollowings = await Publication.find({ user: { $in: followingsIds } });

        let finalPosts = [];

        if (postsByFollowings.length || postsByMyUser.length) {
            const allPosts = [...postsByMyUser, ...postsByFollowings];
            const noDuplicates = [...new Set(allPosts.map(post => post._id))]
                .map(id => allPosts.find(post => post._id === id))
                .sort((a, b) => {
                    if (a.createdAt < b.createdAt) return 1;
                    return -1;
                })

            const filteredPosts = myUser.viewExplicitContent ?
                noDuplicates :
                noDuplicates.filter(post => !post.explicitContent || !post.checkNSFW);

            finalPosts = filteredPosts
        }
        res.status(200).json(finalPosts);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
        next(error);
    }
}