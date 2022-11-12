// import fs from "fs"
// import Sales from "../../models/Sales.js";
// // import mercadopago from 'mercadopago'

export const webHooks = async (req, res, next) => {
    try {

        console.log(req.body)
//         let data = req.body

//         if (data['action'] == 'payment.created') {
//             fs.writeFileSync(`${__dirname}/../webHookResponses.json`, JSON.stringify(data))
//         }

        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        next()
    }

}
