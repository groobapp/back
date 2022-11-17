import mercadopago from 'mercadopago'

// Agrega credenciales

// Creo la preferencia con el tipo de metadata:
// - ID del post
// - ID del usuario a comprar el contenido
// - Datos del usuario a comprar (enviarlos del back )



export const mPayment = async (req, res) => {
  const { userName, postId,  ACCESS_TOKEN, userId, profilePicture, price, quantity, descripcion, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, codPostal, } = req.body

    mercadopago.configure({
      access_token: ACCESS_TOKEN
    });

    try {
      let preference = {
        metadata: {
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