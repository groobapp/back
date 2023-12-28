import User from '../../models/User.js'
import Publication from '../../models/Publication.js'
import fs from "fs-extra"
import { uploadImage } from "../../libs/cloudinary.js";
// import {  deleteImage } from "../libs/cloudinary";
import { closeConnectionInMongoose } from "../../libs/constants.js";
// import { UpdateProfileBodyType, ValidateProfileParamsType } from "../schemas/profile.schema";
// import { GET_REDIS_ASYNC, SET_REDIS_ASYNC } from '../../libs/redis.js';



export const getProfile = async (req, res, next) => {
    try {
        const profileData = await User.findById(req.userId, { password: 0, notifications: 0, chats: 0, visits: 0 })
        res.status(200).json(profileData)
        // const replyFromCache = await GET_REDIS_ASYNC("getProfile")
        // if (replyFromCache !== null && replyFromCache !== undefined && replyFromCache.length > 0) {
        //     console.log("data desde caché: ", replyFromCache)
        //      res.json(JSON.parse(replyFromCache))
        // }
        // else {
        //     const response = await SET_REDIS_ASYNC('getProfile', JSON.stringify(profileData))
        //     console.log("data desde el server sin caché: ", response)
        //     res.status(200).json(profileData)
        // }
        return closeConnectionInMongoose
    } catch (error) {
        console.log("Cannot get profile", error)
        res.status(404).json(error)
        next(error)
    }
}


export const getReducedUser = async (req, res, next) => {
    try {

        const myUser = await User.findById(req.userId, { password: 0, followers: 0, followings: 0, publications: 0, description: 0, firstName: 0, lastName: 0, birthday: 0, createdAt: 0, updatedAt: 0, email: 0, mpAccessToken: 0 })
        console.log(myUser)
        res.status(200).json(myUser)
        return closeConnectionInMongoose
    } catch (error) {
        console.log("Cannot get profile", error)
        res.status(404).json(error)
        next()
    }
}


export const getReducedUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id, { password: 0, followers: 0, followings: 0, publications: 0, description: 0, firstName: 0, lastName: 0, birthday: 0, createdAt: 0, updatedAt: 0, email: 0, mpAccessToken: 0 })
        res.status(200).json(user)

    } catch (error) {
        console.log("Cannot get profile", error)
        res.status(404).json(error)
        next()
    }
}

// Declaración de una variable para almacenar los usuarios aleatorios previamente obtenidos
let previousRandomUsers = [];

export const getAllProfiles = async (req, res, next) => {
    try {
        // const allProfiles = await User.find({}, {
        //     password: 0,
        //     followers: 0,
        //     followings: 0,
        //     publications: 0,
        //     firstName: 0,
        //     lastName: 0,
        //     birthday: 0,
        //     createdAt: 0,
        //     updatedAt: 0,
        //     email: 0,
        //     mpAccessToken: 0,
        //     purchases: 0,
        //     verificationInProcess: 0,
        //     verificationPay: 0,
        //     chats: 0,
        //     notifications: 0,
        //     likes: 0,
        //     phone: 0,
        // });

        const allProfiles = await User.find();

        // Verificar si se han obtenido todos los usuarios existentes
        if (previousRandomUsers.length >= allProfiles.length) {
            // Si ya se han obtenido todos los usuarios, reiniciar el array
            previousRandomUsers = [];
        }

        // Obtener 20 usuarios aleatorios sin repetición
        let randomUsers = [];
        while (randomUsers.length < 20) {
            const randomIndex = Math.floor(Math.random() * allProfiles.length);
            const randomUser = allProfiles[randomIndex];

            // Verificar si el usuario ya ha sido seleccionado anteriormente
            if (!previousRandomUsers.includes(randomUser)) {
                randomUsers.push(randomUser);
                previousRandomUsers.push(randomUser);
            }
        }

        res.status(200).json(randomUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error });
        next(error);
    }
};


export const getProfileById = async (req, res, next) => {
    try {
        const { id } = req.params
        const myUser = await User.findById(req.userId)
        const myId = req.userId?.toString()
        console.log(myUser)
        const profileData = await User.findById(id, {
            password: 0,
            firstName: 0,
            lastName: 0,
            mpAccessToken: 0,
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

        await profileData.save()
        res.status(200).json({ profileData, myId })

        return closeConnectionInMongoose
    } catch (error) {
        console.log("Cannot get profile by id", error)
        res.status(404).json(error)
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const {
            userName, description, birthday, firstName, lastName,
            online, premium, verified, verificationPay, verificationInProcess,
            mpAccountAsociated, mpAccessToken, mpAccount, explicitContent
        } = req.body;
        const { id } = req.params
        const user = await User.findById(id, { password: 0 })
        const userUpdated = await User.findOneAndUpdate(
            { _id: user._id },
            {
                userName, description, birthday, firstName, lastName,
                online, premium, verified, verificationPay, verificationInProcess,
                mpAccountAsociated, mpAccessToken, mpAccount, explicitContent
            })
        await Publication.updateMany({ userName: user.userName }, { userName: userName })
        console.log(userUpdated)
        res.status(200).json({ message: "User updated!" });
        return closeConnectionInMongoose
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next()
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
        return closeConnectionInMongoose
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next()
    }
}


export const deleteProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const myUser = await User.findById({ _id: id })
        console.log(myUser)
        const allPostsToDelete = myUser.publications.map(id => id)

        const allPosts = await Publication.find({
            _id: {
                $in: allPostsToDelete
            }
        })
        const postsDeleted = await Publication.deleteMany({ _id: allPosts })
        const userDeleted = await User.deleteOne({ myUser })
        res.status(200).json({ message: `User and posts deleted`, postsDeleted, userDeleted })
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
        next()
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
        let myPosts = myUser.publications.map((id) => id)
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
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
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
        let myPosts = myUser.publications.map((id) => id)
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
        return closeConnectionInMongoose
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error });
        next(error)
    }
}