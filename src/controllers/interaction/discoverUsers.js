import Publication from '../../models/Publication.js'
import User from '../../models/User.js'

let offset = 0; // Variable para llevar el seguimiento del índice de inicio de la próxima página
const pageSize = 20; // Tamaño de la página

export const discoverUsers = async (req, res, next) => {
    try {
        // Obtener la cantidad total de perfiles
        const totalCount = await User.countDocuments();
        if (totalCount === 0) {
            return res.status(404).json({ message: 'No hay usuarios disponibles.' });
        }

        // Verificar si se ha alcanzado el límite de usuarios
        if (offset >= totalCount) {
            return res.status(200).json([]); // No hay más usuarios para enviar
        }
        // Obtener el siguiente lote de usuarios
        const randomUsers = await User.find().skip(offset).limit(pageSize);
        offset += pageSize; // Incrementar el offset para la próxima solicitud
        res.status(200).json(randomUsers);
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
