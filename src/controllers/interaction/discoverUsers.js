import Publication from '../../models/Publication.js'
import User from '../../models/User.js'
import { closeConnectionInMongoose } from "../../libs/constants.js";


let previousRandomUsers = [];
export const discoverUsers = async (req, res, next) => {
    try {
        const allProfiles = await User.find();

        if (allProfiles.length === 0) {
            return res.status(404).json({ message: 'No hay usuarios disponibles.' });
        }

        if (previousRandomUsers.length >= allProfiles.length) {
            previousRandomUsers = [];
        }

        let randomUsers = [];
        while (randomUsers.length < 20 && randomUsers.length < allProfiles.length) {
            const randomIndex = Math.floor(Math.random() * allProfiles.length);
            const randomUser = allProfiles[randomIndex];

            // Verificar si el usuario ya fue seleccionado anteriormente
            const isUserSelected = previousRandomUsers.some(user => user._id.toString() === randomUser._id.toString());

            if (!isUserSelected) {
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
            return res.status(500).json("Usuario no loggeado")
        }
        const allPublications = await Publication.find()

        const filterByExplicitContentAndImages = allPublications.filter(post => {
            if (post.content && post.images.length === 0 && post.video.length === 0) {
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
