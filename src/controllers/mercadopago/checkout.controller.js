import mercadopago from 'mercadopago'
import User from '../../models/User.js'

export const usersProductsMP = async (req, res) => {
  const { 
    userName, postId, creatorId, profilePicture, price, quantity, descripcion, 
     direccion, numeroDireccion, area, tel, codPostal 
  } = req.body

    const userCreatorMP = await User.findById({_id: creatorId}, { password: 0 })
    mercadopago.configure({
      access_token: userCreatorMP?.mpAccessToken
    });

    const payer = await User.findById(req.userId, { password: 0 })
  
    try {
      let preference = {
        metadata: {
          creator_id: creatorId,
          post_to_buy: postId,     
          user_id: payer?._id,
        },
        items: [
          {
            title: userName,
            unit_price: parseInt(price),
            quantity: parseInt(quantity),
            description: descripcion, 
            currency_id: "ARS",
            picture_url: profilePicture,
          }
        ],
        payer: {
          "name": payer?.firstName,
          "surname": payer?.lastName,
          "email": payer?.email,
          "phone": {
            "area_code": area,
            "number": tel
          },
          "address": {
            "zip_code": codPostal,
            "street_name": direccion,
            "street_number": numeroDireccion
          },
  
        },
        marketplace_fee: 1,
        back_urls: {
          "success": "https://groob.com.ar/notifications/success",
          "pending": "https://groob.com.ar/notifications/pending",
          "failure": "https://groob.com.ar/notifications/error",
        },
        auto_return: "approved",
        notification_url: "https://groob-back-production.up.railway.app/notifications",
      };
  
      mercadopago.preferences.create(preference)
        .then((response) => {
          console.log(response.body)
          res.json(response)
        })
    } catch (error) {
      console.log(error);
      res.json({ "message": error });
    }
}