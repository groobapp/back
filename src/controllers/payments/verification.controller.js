import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PRUE_MP
});

export const verifyAccountPay = async (req, res) => {
  const { idToVerify, title, price, quantity, picURL, descripcion, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, postal, } = req.body
    
    console.log(idToVerify, title, price, quantity, picURL, descripcion, 
        nombre, apellido, email, direccion, numeroDireccion, area, tel, postal, )
  
  const cantidad = parseInt(quantity)
  const precio = parseInt(price)

  try {

    let preference = {
      metadata: {
        userId: idToVerify,
      },
      items: [
        {
          title: title,
          unit_price: 2999,
          quantity: 1,
          description: "Con la verificación de la cuenta obtenés el check azul en tu perfil. Además, en nuestro algoritmo damos múltiples beneficios a estos perfiles.",
          currency_id: "ARS",
          picture_url: picURL,
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
          "zip_code": postal,
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
      notification_url: "https://groob-backend-production.up.railway.app/notifications",
    };

    mercadopago.preferences.create(preference)
      .then((response) => {
        console.log(response)
        res.json(response)
      })


  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }

}