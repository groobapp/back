import User from "../../models/User.js"
import axios from "axios"
import Wallet from "../../models/Wallet.js"

export const webHooks = async (req, res, next) => {
    const { type, data } = req.body
    try {
        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data?.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })
        console.log(compra)
        if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" &&
            compra.data.metadata.coins_quantity && compra.data.metadata.user_buyer) {

            const update = {
                $set: {
                    balance: compra.data.metadata.coins_quantity,
                    $push: {
                        historyPurchases: {
                            price: compra.data.metadata.price,
                            amount: compra.data.metadata.coins_quantity,
                            date: new Date()
                        }
                    }
                }
            };

            const wallet = await Wallet.findByIdAndUpdate(
                { _id: compra.data.metadata.user_buyer },
                update,
                { new: true } // Return the modified document rather than the original
            );

            if (!wallet) {
                return res.status(400).json("No se ha encontrado una billetera");
            }
        }
        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        res.status(403).json(error)
        next(error)
    }
}
