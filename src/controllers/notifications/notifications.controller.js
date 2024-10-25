import Publication from "../../models/Publication.js"
import User from "../../models/User.js"

export const addNotification = async (userId, notificationData) => {
    const user = await User.findById(userId);
    if (user) {
        user.notifications.push(notificationData);
        await user.save();
    }
};



export const notification = async (req, res, next) => {
    try {
        const { postCommentedId, postLikedId, userFollowId, userUnfollowId } = req.body;

        const myUser = await User.findById(req.userId);
        if (!myUser) return res.status(404).json({ message: 'User not found' });

        const myUserId = myUser._id.toString();
        const profilePic = myUser.profilePicture.secure_url;
        const userName = myUser.userName;

        if (postCommentedId) {
            const post = await Publication.findById(postCommentedId);
            if (post) {
                const notificationData = {
                    userName,
                    profilePic,
                    event: "ha dejado un comentario",
                    link: post._id,
                    date: new Date(),
                    read: false,
                };
                await addNotification(post.userIdCreatorPost, notificationData);
            }
        }

        if (postLikedId) {
            const post = await Publication.findById(postLikedId);
            if (post) {
                const notificationData = {
                    userName,
                    profilePic,
                    event: "le ha gustado tu post",
                    link: post._id,
                    date: new Date(),
                    read: false,
                };
                await addNotification(post.userIdCreatorPost, notificationData);
            }
        }

        if (userFollowId) {
            const notificationData = {
                userName,
                profilePic,
                event: "te ha seguido!",
                link: myUserId,
                date: new Date(),
                read: false,
            };
            await addNotification(userFollowId, notificationData);
        }

        if (userUnfollowId) {
            const notificationData = {
                userName,
                profilePic,
                event: "ya no te sigue.",
                link: myUserId,
                date: new Date(),
                read: false,
            };
            await addNotification(userUnfollowId, notificationData);
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


export const getNotificationsLength = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const unreadCount = user.notifications.filter(notification => !notification.read).length;
        res.status(200).json(unreadCount);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


export const getNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const notifications = user.notifications.sort((a, b) => b.date - a.date);

        user.notifications.forEach(notification => {
            notification.read = true;
        });

        await user.save();
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
