import Wallet from '../../models/Wallet.js'

export const createWithdrawalRequest = async (req, res, next) => {
    try {
        const { amountCoins, amountMoney, currency } = req.body
        if (isNaN(amountCoins) || amountCoins <= 0) {
            return res.status(400).json({ error: "Cantidad de monedas no válida" });
        }
        if (isNaN(amountMoney) || amountMoney <= 0) {
            return res.status(400).json({ error: "Cantidad de dinero no válida" });
        }
        if (!currency || currency.length !== 3) {
            return res.status(400).json({ error: "Moneda no válida" });
        }
        const wallet = await Wallet.findOne({ user: req.userId })
        if (!wallet) {
            return res.status(404).json({ message: 'Billetera no encontrada.' });
        }

        wallet.withdrawalRequests.push({
            amountCoins,
            amountMoney,
            currency
        })

        await wallet.save()
        res.status(200).json("Solicitud de retiro creada!")
    } catch (error) {
        console.log(error)
        res.status(403).json(error);
        next(error)
    }
}


// traer todas las wallets y ordenarlas por fecha de las withdrawalRequests y que además
// tranferMade y paymentAcreditedStatus sean false