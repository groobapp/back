import User from "../../models/User.js"
import axios from "axios"

export const redirectUrlMp = async (req, res, next) => {
    console.log(req.body)

    res.status(200).send(req.body)


}
