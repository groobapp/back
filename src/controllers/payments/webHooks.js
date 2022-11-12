import User from "../../models/User.js"
import axios from "axios"

//     {
//     action: 'test.created',
//     api_version: 'v1',
//     application_id: '6604225923180824',
//     date_created: '2021-01-01 02:02:02 +0000 UTC',
//     id: '123456',
//     live_mode: 'false',
//     type: 'test',
//     user_id: 429637065,
//     data: { id: '123456789' }
//     }

export const webHooks = async (req, res, next) => {
    const { type, user_id, data } = req.body
    try {

        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_PRUE_MP}`
            }
        })
        console.log("FETCH A PAYMENTS", compra.data)
        
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
    //Probar con esto sin el res anterior
    // Además, ahora recibo las notificaciones
    // Motrar la notificacion con los datos o hacer un cartel
    // Continuar proceso de verificación (DB y back)
    // Hacer formulario para el usuario
    // Una vez llenado el form, actualizar la DB
    // Aplicar la insignia al usuario
    res.status(200).send('ok')

}
