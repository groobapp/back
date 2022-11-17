import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PROD_MP
});

export const verifyAccountPay = async (req, res) => {
  const { verifyId, title, quantity, price, descripcion, picURL, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, postal, } = req.body
    
  try {
    let preference = {
      metadata: {
        user_to_verify: verifyId
      },
      items: [
        {
          title: title,
          unit_price: parseInt(price),
          quantity: parseInt(quantity),
          description: descripcion, 
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
      notification_url: "https://groob-back-production.up.railway.app/notifications",
    };

    mercadopago.preferences.create(preference)
      .then((response) => {
        res.json(response)
      })
  } catch (error) {
    console.log(error);
    res.json({ "message": error });
  }

}