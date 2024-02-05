import User from "../../models/User.js"
import axios from "axios"
import Wallet from "../../models/Wallet.js"

export const webHooks = async (req, res, next) => {
    const { type, data } = req.body
    console.log("BODY", req.body)
    try {
        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })
        console.log("COMPRA:", compra)
        if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" &&
            compra.data.metadata.coins_quantity && compra.data.metadata.user_buyer) {
            const wallet = await Wallet.findById({ _id: compra.data.metadata.user_buyer })
            if (wallet === undefined || wallet === null) {
                res.status(400).json("No se ha encontrado una billetera")
            }
            wallet.balance = compra.data.metadata.coins_quantity
            wallet.historyPurchases = wallet.historyPurchases.push({
                price: compra.data.metadata.price,
                amount: compra.data.metadata.coins_quantity,
                date: new Date()
            })
            await wallet.save()
        }
        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        res.status(403).json(error)
        next(error)
    }
}
