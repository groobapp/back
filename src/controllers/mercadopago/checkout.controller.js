import mercadopago from 'mercadopago'

export const usersProductsMP = async (req, res) => {
  const { userName, postId, userId, creatorId, profilePicture, price, quantity, descripcion, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, codPostal, } = req.body


    console.log("postID", postId)
    console.log("userID", userId)
    console.log("creatorID", creatorId)

    const userMP = await User.findById({_id: creatorId}, { password: 0 })
    mercadopago.configure({
      access_token: userMP?.mpAccessToken
    });
    
    console.log(userMP?.mpAccessToken)

    try {
      let preference = {
        metadata: {
          creator_id: creatorId,
          post_to_buy: postId,     
          user_id: userId,
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
          "name": nombre,
          "surname": apellido,
          "email": email,
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