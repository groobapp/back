import Wallet from '../../models/Wallet.js'

// traer todas las wallets y ordenarlas por fecha de las withdrawalRequests y que además
// tranferMade y paymentAcreditedStatus sean false
export const getWalletsWithWithdrawlRequests = async (req, res, next) => {
    try {
        const wallets = await Wallet.find({}).sort({ 'withdrawalRequests.date': 1 }).filter(wallet => {
            return wallet.withdrawalRequests.some(request => request.tranferMade === false && request.paymentAcreditedStatus === false);
        });
        res.status(200).json(wallets);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener las wallets.' });
        next(error);
    }
};