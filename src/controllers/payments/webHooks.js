// import User from "../../models/User"

// {
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
    try {

        const { data } = req.body
        const compra = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_PRUE_MP}`
            }
        })
        console.log(compra.data)

        // if(compra.data.status === "approved" && compra.data.status_detail === "accredited") {
        //     const user = await User.findByIdAndUpdate({_id: compra.data.items.id}, {
        //         verificationPay: true
        //     })
        // }
        
        res.status(200).send('ok')
    } catch (error) {
        console.log(error)
        next()
    }


}
