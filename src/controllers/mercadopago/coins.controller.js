import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN_PROD_MP
});

export const buyCoins = async (req, res) => {
  const { price, coinsQuantity, id, monedaDeFrente } = req.body

  try {
    let preference = {
      metadata: {
        userBuyer: id,
        coinsQuantity: parseInt(coinsQuantity),
        price: parseInt(price),
      },
      items: [
        {
          title: "Monedas",
          unit_price: parseInt(price),
          quantity: 1,
          description: "Las monedas son consumibles para desbloquear contenido, experiencias de streaming, servicios de videollamada y realizar donaciones dentro de la plataforma. Son acumulables y podrás canjearlas por dinero real.",
          currency_id: "ARS",
          picture_url: monedaDeFrente,
        }
      ],
      back_urls: {
        "success": "https://groob.app/notifications/success",
        "pending": "https://groob.app/notifications/pending",
        "failure": "https://groob.app/notifications/error",
      },
      auto_return: "approved",
      notification_url: "https://groob.onrender.com/notifications",
    };

    mercadopago.preferences.create(preference)
      .then((response) => {
        res.json(response)
      })
  } catch (error) {
    console.log(error);
    res.json({ message: error });
    next(error)
  }

}