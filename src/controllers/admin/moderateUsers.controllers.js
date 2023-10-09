import User from '../../models/User.js'

export const createDenounceUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const User = await User.findById({ _id: id })
        const user = await User.findById(req.userId)
        User.denouncement = User.denouncement.concat(user._id)
        await User.save()
        console.log("User denunciado")
        res.status(200).json("User denunciado")
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
        next()
    }
}


export const getDenounceUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const User = await User.findById({ _id: id })
        const user = await User.findById(req.userId)
        User.denouncement = User.denouncement.concat(user._id)
        await User.save()
        console.log("User denunciado")
        res.status(200).json("User denunciado")
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
        next()
    }
}


export const updateDenounceUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const User = await User.findById({ _id: id })
        const user = await User.findById(req.userId)
        User.denouncement = User.denouncement.concat(user._id)
        await User.save()
        console.log("User denunciado")
        res.status(200).json("User denunciado")
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
        next()
    }
}


export const deleteDenounceUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const User = await User.findById({ _id: id })
        const user = await User.findById(req.userId)
        User.denouncement = User.denouncement.concat(user._id)
        await User.save()
        console.log("User denunciado")
        res.status(200).json("User denunciado")
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
        next()
    }
}
