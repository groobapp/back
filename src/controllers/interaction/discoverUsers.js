import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
import { closeConnectionInMongoose } from "../../libs/constants.js";


let previousRandomUsers = [];
export const discoverUsers = async (req, res, next) => {
    try {
        if (!req.userId) {
            res.status(401).json("Usuario no loggeado")
            return
        }
        const allProfiles = await User.find();

        if (previousRandomUsers.length >= allProfiles.length) {
            previousRandomUsers = [];
        }

        let randomUsers = [];
        while (randomUsers.length < 20) {
            const randomIndex = Math.floor(Math.random() * allProfiles.length);
            const randomUser = allProfiles[randomIndex];

            if (!previousRandomUsers.includes(randomUser)) {
                randomUsers.push(randomUser);
                previousRandomUsers.push(randomUser);
            }
        }

        res.status(200).json(randomUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al obtener perfiles aleatorios' });
        next(error);
    }
};

export const discoverPostsWithImages = async (req, res, next) => {
    try {
        if (!req.userId) {
            res.status(500).json("Usuario no loggeado")
            return
        }
        const allPublications = await Publication.find({}, {
            title: 0,
            videos: 0,
            content: 0,
            likes: 0,
            liked: 0,
            buyers: 0,
            comments: 0,
            denouncement: 0,
        })

        const filterByExplicitContentAndImages = allPublications.filter(post => {
            if (post.images.length > 0 && post.images[0].secure_url !== undefined
                && post.price === 0) {
                return post;
            }
        })
        const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(orderByDate)

        return closeConnectionInMongoose;
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}


export const discoverPostsWithTexts = async (req, res, next) => {
    try {
        if (!req.userId) {
            res.status(500).json("Usuario no loggeado")
            return
        }
        const allPublications = await Publication.find({}, {
            title: 0,
            videos: 0,
            images: 0,
            denouncement: 0,
        })

        const filterByExplicitContentAndImages = allPublications.filter(post => {
            if (post.content) {
                return post;
            }
        })
        const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(orderByDate)

        return closeConnectionInMongoose;
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}
