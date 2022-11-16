import User from "../../models/User.js"
import axios from "axios"

export const webHooks = async (req, res, next) => {
    const { type, user_id, data } = req.body
    try {

        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data?.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ACCESS_TOKEN_PROD_MP}`
            }
        })
        
        if (type === "payment" &&
            compra.data.status === "approved" &&
            compra.data.status_detail === "accredited") {
            const user = await User.findByIdAndUpdate({ _id: compra.data.metadata.user_id }, {
                verificationPay: true
            })
            await user.save()
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
