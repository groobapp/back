import mercadopago from 'mercadopago'

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PRUE_MP
});

// Usuario conecta su cuenta de MP
// Obtengo sus datos para crear preferencias
// Obtengo sus datos para enviarle la plata
// Sube un contenido
// Un usuario da click en "Comprar"
// Creo la preferencia con el tipo de metadata:
// - ID del post
// - ID del usuario a comprar el contenido
// - Datos del usuario a comprar (enviarlos del back )



export const mPayment = async (req, res) => {
  const { userName, postId, user_id, profilePicture, price, quantity, descripcion, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, codPostal, } = req.body
  
    try {
      let preference = {
        metadata: {
          postToBuy: postId,     
          userId: user_id,
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