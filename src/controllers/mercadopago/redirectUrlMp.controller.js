import User from "../../models/User.js"
import MpAccout from "../../models/MpAccount.js"

import axios from "axios"

const CLIENT_SECRET = process.env.CLIENT_SECRET_MP
const CLIENT_ID = process.env.CLIENT_ID_MP

export const redirectUrlMp = async (req, res, next) => {
    const { code, state } = req.query
    try {
        const { data } = await axios.post(`https://api.mercadopago.com/oauth/token`, {
            client_secret: CLIENT_SECRET,
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            redirect_uri: "https://groob-back-production.up.railway.app/mp-connect",
            code: code,

        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })

        const newMpAccount = new MpAccout({
            access_token: data.access_token,
            token_type: data.token_type,
            user_id: data.user_id,
            refresh_token: data.refresh_token,
            public_key: data.public_key,
            user: state,
        })

        await User.findByIdAndUpdate({ _id: state }, {
            mpAccount: newMpAccount._id,
            mpAccessToken: data.access_token,
            mpAccountAsociated: true,
        })

        res.redirect("https://groob.app/user")

    } catch (error) {
        console.log(error)
        res.json(error)
        next()
    }
}
