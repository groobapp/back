import User from "../../models/User.js"
import axios from "axios"

export const redirectUrlMp = async (req, res, next) => {
    const { code } = req.query

    res.status(200).send(code)


}
