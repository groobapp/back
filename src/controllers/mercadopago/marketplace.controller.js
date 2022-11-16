// ID: 6604225923180824

import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PROD_MP
});

export const marketplace = async (req, res) => {
 try {
    res.json(mercadopago)
  } catch (error) {
    console.log(error);
    res.json({ "message": error });
  }

}