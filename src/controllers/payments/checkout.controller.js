import mercadopago from 'mercadopago'

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PRUE_MP
});

export const mPayment = async (req, res) => {
  const { productTitle, price, quantity, descripcion, 
    nombre, apellido, email, direccion, numeroDireccion, area, tel, postal, } = req.body

  // const cantidad = parseInt(quantity)
  // const precio = parseInt(price)
  // try {

  //   let preference = {
  //     items: [
  //       {
  //         title: "compu",
  //         unit_price: 1000,
  //         quantity: 1,
  //         description: "soy una loca loca",
  //         currency_id: "ARS",
  //       }
  //       // {
  //       //   title: productTitle,
  //       //   unit_price: precio,
  //       //   quantity: cantidad,
  //       //   description: descripcion,
  //       //   currency_id: "ARS",
  //       // }
  //     ],
  //     // payer: {
  //     //   "name": nombre,
  //     //   "surname": apellido,
  //     //   "email": email,
  //     //   "phone": {
  //     //     "area_code": area,
  //     //     "number": tel
  //     //   },
  //     //   "address": {
  //     //     "zip_code": postal,
  //     //     "street_name": direccion,
  //     //     "street_number": numeroDireccion
  //     //   },

  //     // },
      
  //     back_urls: {
  //       "success": "htpp://localhost:5173/success",
  //       "pending": "htpp://localhost:5173/pending",
  //       "failure": "htpp://localhost:5173/error",
  //     },
  //     auto_return: "approved",
  //     notification_url: "htpp://localhost:5173/success",
  //   };

  //   mercadopago.preferences.create(preference)
  //     .then((response) => {
  //       console.log(response)
  //       res.json(response)
  //     })


  // } catch (error) {
  //   console.log(error);
  //   res.json({ message: error });
  // }

}