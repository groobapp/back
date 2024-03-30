import Publication from '../../models/Publication.js'
import User from '../../models/User.js'

let offset = 0; // Variable para llevar el seguimiento del índice de inicio de la próxima página
const pageSize = 20; // Tamaño de la página
let allProfiles = []; // Variable para almacenar todos los perfiles

export const discoverUsers = async (req, res, next) => {
    try {
        if (allProfiles.length === 0 || offset >= allProfiles.length) {
            // Si no hay perfiles cargados o se han enviado todos, cargar nuevamente todos los perfiles
            allProfiles = await User.find().limit(500);
            offset = 0; // Restablecer el offset a cero
        }
        // Obtener el siguiente lote de usuarios
        const randomUsers = allProfiles.slice(offset, offset + pageSize);
        offset += pageSize; // Incrementar el offset para la próxima solicitud
        res.status(200).json(randomUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener perfiles aleatorios' });
        next(error);
    }
};

let allProfiles2 = []; // Declara una variable para almacenar todos los perfiles
let offset2 = 0; // Declara una variable para el offset
const pageSize2 = 50; // Tamaño de la página

export const discoverCreators = async (req, res, next) => {
    try {
        if (allProfiles2.length === 0 || offset2 >= allProfiles2.length) {

            allProfiles2 = await User.find().limit(500);
            offset2 = 0;
        }

        const randomUsers = allProfiles.slice(offset2, offset2 + pageSize2);
        const randomUserIds = randomUsers.map(user => user._id);

        const postsFromRandomUsers = await Publication.find({
            userIdCreatorPost: { $in: randomUserIds },
            price: { $gt: 0 }
        });

        const filteredPosts = postsFromRandomUsers.filter(post => {
            return (post.images.length > 0 && post.checkExclusive);
        });

        const userIds = filteredPosts.map(post => post.userIdCreatorPost);
        const filteredRandomUsers = randomUsers.filter(user => userIds.includes(user._id));
        offset += pageSize; // Incrementar el offset para la próxima solicitud
        res.status(200).json(filteredRandomUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener perfiles aleatorios' });
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
            video: 0,
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
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}

export const discoverPostsWithVideos = async (req, res, next) => {
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
            if (post.video.length > 0 && post.video[0].secure_url !== undefined
                && post.price === 0) {
                return post;
            }
        })
        const orderByDate = filterByExplicitContentAndImages.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(orderByDate)
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
    } catch (error) {
        console.log({ "message": error })
        next(error)
    }
}
