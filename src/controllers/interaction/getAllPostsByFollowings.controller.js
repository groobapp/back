import User from '../../models/User.js';
import Publication from '../../models/Publication.js';
import { closeConnectionInMongoose } from '../../libs/constants.js';

const getAllPostsByFollowings = async (req, res, next) => {
    try {
        const myUser = await User.findById(req.userId, '-password -mpAccessToken -followers -firstName -lastName -birthday -createdAt -updatedAt -email')
            .populate('publications', '_id')
            .populate('followings', '_id');
        if (!myUser) {
            res.status(500).send("Usuario no loggeado")
            return
        }

        const myPosts = myUser.publications.map(pub => pub._id);
        const postsByMyUser = await Publication.find({ _id: { $in: myPosts } });

        const followingsIds = myUser.followings.map(following => following._id);
        const postsByFollowings = await Publication.find({ user: { $in: followingsIds } });

        let finalPosts = [];

        if (postsByFollowings.length || postsByMyUser.length) {
            const allPosts = [...postsByMyUser, ...postsByFollowings];
            const uniquePosts = Array.from(new Set(allPosts.map(post => post._id))).map(id => allPosts.find(post => post._id === id));

            const filteredPosts = myUser.explicitContent || myUser.checkNSFW ?
                uniquePosts :
                uniquePosts.filter(post => !post.explicitContent || !post.checkNSFW);

            finalPosts = filteredPosts.sort((a, b) => b.createdAt - a.createdAt);
        }

        res.status(200).json(finalPosts);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
        next(error);
    } finally {
        closeConnectionInMongoose();
    }
};

export default getAllPostsByFollowings;
