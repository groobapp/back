import jwt from "jsonwebtoken"

export const TokenValidator = async (req, res, next) => {
    const token = req.header('authtoken')
    if(!token) return res.status(401).json({
        error: "acceso denegado",
        auth: false,
        message: 'Access denied'
    })
    try {
        console.log(token)
        const payload = jwt.verify(token, process.env.TOKEN_KEY_JWT || 'tokentest')
        console.log(payload) 
        req.userId = payload._id
        next()
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" })
    }
}
