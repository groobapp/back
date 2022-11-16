import User from "../../models/User.js"
import axios from "axios"

export const redirectUrlMp = async (req, res, next) => {
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    res.status(200).send("Recibí algo")


}
