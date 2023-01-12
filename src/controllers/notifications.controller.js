import Publication from "../models/Publication"
import User from "../models/User"

export const notification = async (req, res, next) => {
    try {
        const { postCommentedId, postLikedId, newChatId } = req.body
        const myUser = await User.findById(req.userId)
        const profilePic = myUser?.profilePicture.secure_url
        const userName = myUser?.userName
        const post = await Publication.findById({ _id: postLikedId })
        const userId = post?.user
        const user = await User.findById({ _id: userId })
        if (user !== undefined && postLikedId) {
            user.notifications = user.notifications.concat({ 
                userName: userName, 
                profilePic: profilePic, 
                event: "le ha gustado tu post",
                link: post._id
            })
            await user.save()
        }
        if (user !== undefined && postCommentedId !== undefined) {
            user.notifications = user.notifications.push(`${profilePic} ${userName}, comentó tu post ${postCommentedId}`)
            await user.save()
        
        } else {
            return
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
        // user.notifications = []
        // await user.save()
    } catch (error) {
        console.log(error)
        next()
    }
}

export const getNotifications = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const notifications = user?.notifications
        res.status(200).json(notifications)
        user.notifications = []
        await user.save()
    } catch (error) {
        console.log(error)
        next()
    }
}