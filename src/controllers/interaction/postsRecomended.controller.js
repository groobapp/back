import Publication from '../../models/Publication.js'

export const postsRecomended = async (_req, res, next) => {
    try {
        const allPublications = await Publication.find()
        const filterByPhoto = allPublications.filter(post => {
            if (post.images.length > 0 && post.checkExclusive === false || post.images.length > 0 && post.checkNSFW === false) {
                return post;
            }
        }).sort((a, b) => {
            if (a.likes < b.likes) return 1;
            return -1;
        })
        const noDuplicates = [...new Set(filterByPhoto.map(post => post._id))]
            .map(id => filterByPhoto.find(post => post._id === id));
        res.status(200).json(noDuplicates)
    } catch (error) {
        console.log(error)
        res.status(500).json({ "message": error })
        next(error)
    }
}