import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PROD_MP
});

export const buyCoins = async (req, res) => {
  const { price, quantity, id, monedaDeFrente } = req.body

  try {
    let preference = {
      metadata: {
        userBuyer: id,
        coinsQuantity: parseInt(quantity),
        price: parseInt(price),
      },
      items: [
        {
          title: "Monedas",
          unit_price: parseInt(price),
          quantity: parseInt(quantity),
          description: "Las monedas son consumibles para desbloquear contenido, experiencias de streaming, servicios de videollamada y realizar donaciones dentro de la plataforma. Son acumulables y podrás canjearlas por dinero real.",
          currency_id: "ARS",
          picture_url: monedaDeFrente,
        }
      ],
      back_urls: {
        "success": "https://groob.com.ar/notifications/success",
        "pending": "https://groob.com.ar/notifications/pending",
        "failure": "https://groob.com.ar/notifications/error",
      },
      auto_return: "approved",
      notification_url: "https://groob.onrender.com/notifications",
    };

    mercadopago.preferences.create(preference)
      .then((response) => {
        console.log(response)
        res.json(response)
      })
  } catch (error) {
    console.log(error);
    res.json({ message: error });
    next(error)
  }

}