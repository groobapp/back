import User from "../../models/User.js"
import axios from "axios"

export const redirectUrlMp = async (req, res, next) => {
    const { code, state } = req.query

    try {
        const result = await axios.post(`https://api.mercadopago.com/oauth/token`, {
            client_secret: process.env.CLIENT_SECRET_MP,
            client_id: process.env.CLIENT_ID_MP,
            grant_type: "authorization_code",
            code: code,

        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PRUE_MP}`
            }
        })
        console.log(result)
        res.status(200).json("veamos q tul")

    } catch (error) {
        console.log(error)
        res.json(error)
        next()
    }
}
