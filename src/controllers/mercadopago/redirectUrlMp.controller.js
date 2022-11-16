import User from "../../models/User.js"
import axios from "axios"

export const redirectUrlMp = async (req, res, next) => {
    const { code, state } = req.query

    const generateAccessToken = await axios.post(`https://api.mercadopago.com/oauth/token`, {
        client_id: process.env.CLIENT_ID_MP,
        client_secret: process.env.CLIENT_SECRET_MP,
        code: code,
        grant_type: "authorization_code",

    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
        }
    })
    res.status(200).send(generateAccessToken)
}
