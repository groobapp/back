import User from "../../models/User.js"
import Publication from "../../models/Publication.js"
import axios from "axios"

export const webHooks = async (req, res, next) => {
    const { type, data } = req.body
    console.log(type, data)
    try {

        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data?.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })

        if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" && compra.data.metadata.user_to_verify) {
            const user = await User.findByIdAndUpdate({ _id: compra.data.metadata.user_to_verify }, {
                verificationPay: true
            })
            await user.save()
        } else if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited" &&
            compra.data.metadata.post_to_buy && compra.data.metadata.user_id) {
            console.log(compra.data.metadata.user_id)
            console.log(compra.data.metadata.post_to_buy)
            const user = await User.findById({ _id: compra.data.metadata.user_id })
            if (user !== undefined) {
                user.purchases = user.purchases.concat(compra.data.metadata.post_to_buy)
            }
            await user.save()
            const publication = await Publication.findById({ _id: compra.data.metadata.post_to_buy })
            if (publication !== undefined) {
                publication.buyers = publication.buyers.concat(compra.data.metadata.user_id)
            }
            await publication.save()
        }
        res.status(200).send('ok')

    } catch (error) {
        console.log(error)
        next()
    }
    // Hacer formulario para el usuario
    // Una vez llenado el form, actualizar la DB
    // Aplicar la insignia al usuario

}
