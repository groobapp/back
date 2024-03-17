import User from '../../models/User.js'
import Publication from '../../models/Publication.js'
import fs from "fs-extra"
import { uploadImage } from "../../libs/cloudinary.js";
// import {  deleteImage } from "../libs/cloudinary";
import Wallet from '../../models/Wallet.js';
// import { UpdateProfileBodyType, ValidateProfileParamsType } from "../schemas/profile.schema";
// import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js';



export const getProfile = async (req, res, next) => {
    try {
        const profileData = await User.findById(req.userId, { password: 0, notifications: 0, chats: 0, visits: 0 })
        res.status(200).json(profileData)

    } catch (error) {
        console.log("Cannot get profile", error)
        res.status(404).json(error)
        next(error)
    }
}


export const getProfileById = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await User.findById(id, {
            password: 0,
            firstName: 0,
            lastName: 0,
            purchases: 0,
            verificationInProcess: 0,
            verificationPay: 0,
            chats: 0,
            notifications: 0,
            phone: 0,
        })

        // if (profileData && myId) {
        //     profileData.visits = profileData.visits.concat(myId)
        //     profileData.notifications = profileData.notifications.concat({
        //         userName: myUser?.userName,
        //         profilePic: myUser?.profilePic,
        //         event: "visitó tu perfil",
        //         link: myId,
        //         date: new Date(),
        //         read: false,
        //     })
        // }

        res.status(200).json(data)

    } catch (error) {
        console.log(error)
        res.status(404).json(error)
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        if (!req.userId) return res.status(401).json({ message: "Usuario no loggeado" })

        const { id } = req.params
        if (!id) return res.status(400).json({ message: "No se ha recibido un id para actualizar el usuario" })

        const {
            userName, description, birthday, email, firstName, lastName,
            premium, verified, verificationPay, verificationInProcess,
            viewExplicitContent, phone, gender, expoPushToken
        } = req.body;
        if (!req.body) return res.status(400).json({ message: "No se ha recibido un body" })

        const user = await User.findById(id, { password: 0 })
        if (!user) return res.status(400).json({ message: "No se ha encontrado el usuario" })

        await User.findOneAndUpdate(
            { _id: user._id },
            {
                userName, description, birthday, email, firstName, lastName,
                premium, verified, verificationPay, verificationInProcess,
                viewExplicitContent, phone, gender, expoPushToken
            })
        await Publication.updateMany({ userName: user.userName }, { userName: userName })
        res.status(200).json({ message: "User updated!" });

    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next(error)
    }
}


export const pictureProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId, { password: 0 })

        if (!user) return;
        if (!req.files) return;

        let obj = {}
        if (req.files) {
            const files = req.files['image']
            if (files) {
                console.log(files)
                for (const file of files) {
                    const result = await uploadImage({ filePath: file.path })
                    obj = {
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                    }
                    await fs.unlink(file.path)
                }
            }
        }
        user.profilePicture = obj
        const userUpdated = await user.save()
        const pictureUpdated = userUpdated.profilePicture
        await Publication.updateMany({ userName: user.userName }, { profilePicture: pictureUpdated.secure_url })
        res.status(200).json({ pictureUpdated });

    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next(error)
    }
}


export const deleteAccount = async (req, res, next) => {
    try {
        const myUser = await User.findById({ _id: req.userId })
        if (!myUser) {
            return res.status(400).json("Usuario no encontrado")
        }
        const allPostsToDelete = myUser.publications.map(id => id)

        const allPosts = await Publication.find({
            _id: {
                $in: allPostsToDelete
            }
        })

        const wallet = await Wallet.find({
            _id: {
                $in: myUser.wallet
            }
        })

        const postsDeleted = await Publication.deleteMany({ _id: allPosts })
        const walletDeleted = await Wallet.deleteOne({ _id: wallet._id })
        const userDeleted = await User.deleteOne({ myUser })
        res.status(200).json({ message: `Info deleted`, postsDeleted, userDeleted, walletDeleted })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        next(error)
    }
}

export const getAllPostsWithOutPriceByUser = async (req, res, next) => {
    try {
        const myUser = await User.findById(req.userId, {
            password: 0,
            mpAccessToken: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
        })
        if (!myUser) {
            res.status(401).json("No se ha encontrado un usuario")
        }

        let myPosts = myUser.publications?.map((id) => id)
        const filterPosts = await Publication.find({
            _id: {
                $in: myPosts
            }
        })
        const postsByUser = filterPosts.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        }).filter((post) => post.price === 0)

        res.status(200).json(postsByUser)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
        next(error)
    }
}


export const getAllPostsByUser = async (req, res, next) => {
    try {
        const myUser = await User.findById(req.userId, {
            password: 0,
            mpAccessToken: 0,
            followers: 0,
            firstName: 0,
            lastName: 0,
            birthday: 0,
            createdAt: 0,
            updatedAt: 0,
            email: 0
        })
        if (!myUser) return res.status(401).json("No se ha encontrado un usuario")

        let myPosts = myUser.publications?.map((id) => id)
        const filterPosts = await Publication.find({
            _id: {
                $in: myPosts
            }
        })
        const postsByUser = filterPosts.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(postsByUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
        next(error)
    }
}