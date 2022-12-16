import Publication from '../../models/Publication.js'
import User from '../../models/User.js'

export const postsRecomended = async (req, res, next) => {
    try {

        const allPublications = await Publication.find()
        const filterByPhoto = allPublications.filter(post => {
                if (post.images.length > 0) {
                    return post;
                }
            }).sort((a, b) => {
                if (a.likes < b.likes) return 1;
                return -1;
            }).sort((a, b) => {
                if (a.userVerified < b.userVerified) return 1;
                return -1;
            })

        // Evitar publicaciones repetidas
        const noDuplicates = [...new Set(filterByPhoto.map(post => post._id))]
        .map(id => filterByPhoto.find(post => post._id === id));

        res.status(200).json(noDuplicates)
        
    } catch (error) {
        console.log(error)
        next()
    }
}