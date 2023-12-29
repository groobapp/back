import User from "../../models/User.js"
import axios from "axios"
import Wallet from "../../models/Wallet.js"

export const webHooks = async (req, res, next) => {
    const { type, data } = req.body
    console.log(type, data)
    try {

        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data?.userBuyer}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })

        if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" && compra.data.metadata.userBuyer) {
            const user = await User.findById({ _id: compra.data.userBuyer })

            await user.save()
        } else if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" &&
            compra.data.metadata.coinsQuantity) {
            const wallet = await Wallet.findById({ _id: compra.data.metadata.user_id })
            if (wallet === undefined || wallet === null) {
                return res.status(400).json("No se ha encontrado una billetera")
            }
            wallet.balance = compra.data.metadata.coinsQuantity
            wallet.historyPurchases = wallet.historyPurchases.push({
                price: compra.data.metadata.price,
                amount: compra.data.metadata.coinsQuantity,
                date: new Date()
            })
            await wallet.save()
        }
        res.status(200).send('ok')

    } catch (error) {
        console.log(error)
        next(error)
    }
}
