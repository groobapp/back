import Publication from "../models/Publication.js"
import User from "../models/User.js"

export const notification = async (req, res, next) => {
    try {
        const { postCommentedId, postLikedId, userFollowId, userUnfollowId } = req.body

        const myUser = await User.findById(req.userId)
        const myUserId = myUser?._id.toString()
        const profilePic = myUser?.profilePicture.secure_url
        const userName = myUser?.userName

        if (postCommentedId) {
            const post = await Publication.findById({ _id: postCommentedId })
            const userId = post?.user
            const user = await User.findById({ _id: userId })
            user.notifications = user.notifications.concat({
                userName: userName,
                profilePic: profilePic,
                event: "ha dejado un comentario",
                link: post._id,
                date: new Date()
            })
            await user.save()
        }
        if (postLikedId) {
            const post = await Publication.findById({ _id: postLikedId })
            const userId = post?.user
            const user = await User.findById({ _id: userId })
            user.notifications = user.notifications.concat({
                profilePic: profilePic,
                userName: `A ${userName}`,
                event: "le ha gustado tu post",
                link: post._id,
                date: new Date()
            })
            await user.save()
        }
        if (userFollowId) {
            const user = await User.findById({ _id: userFollowId })
            user.notifications = user.notifications.concat({
                profilePic: profilePic,
                userName: userName,
                event: "te ha seguido!",
                link: myUserId,
                date: new Date()
            })
            await user.save()
        }
        if (userUnfollowId) {
            const user = await User.findById({ _id: userUnfollowId })
            user.notifications = user.notifications.concat({
                userName: userName,
                profilePic: profilePic,
                event: "ya no te sigue.",
                link: myUserId,
                date: new Date()
            })
            await user.save()
        }
        res.status(200).send({ message: 'Success' })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getNotificationsLength = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const notifications = user?.notifications
        res.status(200).json(notifications.length)
    } catch (error) {
        console.log(error)
        next()
    }
}

export const getNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const notifications = user?.notifications
        const notificationsSorted = notifications.sort((a, b) => {
            if (a.date - b.date) return 1;
            return -1;
        }
        )
        console.log(notificationsSorted)
        res.status(200).json(notificationsSorted)
        user.notifications = []
        await user.save()
    } catch (error) {
        console.log(error)
        next()
    }
}