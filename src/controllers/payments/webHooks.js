import fs from "fs"
import Sales from "../../models/Sales";
// import mercadopago from 'mercadopago'

export const webHook = async (req, res) => {
    try {

        console.log(req.body)
        let data = req.body

        if (data['action'] == 'payment.created') {
            fs.writeFileSync(`${__dirname}/../webHookResponses.json`, JSON.stringify(data))
        }

        res.status(200).send({ result: 'ok', message: 'Gracias' })
    } catch (error) {
        console.log(error)
    }

}
