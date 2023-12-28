import User from '../../models/User.js'
import Wallet from '../../models/Wallet.js'
import Publication from '../../models/Publication.js'

export const buyContentById = async (req, res, next) => {
    try {
        const { postId } = req.body
        const userBuyer = await User.findById(req.userId)
        const walletBuyer = await Wallet.findOne({ user: req.userId })

        if (!userBuyer || !walletBuyer) {
            return res.status(404).json({ message: 'No se han encontrado usuario y/o billetera alguna.' });
        }

        const postToBuy = await Publication.findById({ _id: postId })
        if (!postToBuy) {
            return res.status(404).json({ message: 'El post no existe.' });
        }

        if (walletBuyer.balance < postToBuy.price) {
            return res.status(400).json({ message: 'Saldo insuficiente para adquirir el contenido.' });
        }

        if (postToBuy.userIdCreatorPost === userBuyer._id) {
            return res.status(404).json({ message: 'No puedes autocomprarte.' });
        }
        // hasta acá anda

        const creatorContent = await User.findById({ _id: postToBuy.userIdCreatorPost })

        if (!creatorContent) {
            return res.status(404).json({ message: 'Creador de contenido no encontrado.' });
        }
        console.log(creatorContent)

        const walletCreatorContent = await Wallet.findById({ _id: creatorContent.wallet })
        if (!walletCreatorContent) {
            console.log(walletCreatorContent)
            return res.status(404).json({ message: 'Billetera del creador no encontrada.' });
        }
        console.log(walletCreatorContent)

        walletBuyer.balance = walletBuyer.balance - postToBuy.price
        walletCreatorContent.balance = walletCreatorContent.balance + postToBuy.price

        const coinsTransferred = {
            amount: postToBuy.price,
            receiver: creatorContent._id,
        };
        const coinsReceived = {
            amount: postToBuy.price,
            sender: userBuyer._id,
        };

        walletBuyer.coinsTransferred = coinsTransferred;
        walletCreatorContent.coinsReceived = coinsReceived;

        userBuyer.purchases.push(postId)
        postToBuy.buyers.push(userBuyer._id)

        const walletComprador = await walletBuyer.save()
        console.log("walletComprador", walletComprador)

        const walletVendedor = await walletCreatorContent.save()
        console.log("walletVendedor", walletVendedor)

        await userBuyer.save()

        res.status(200).json({ message: "Compra realizada." })
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error)
        next(error)
    }
}

export const getWallet = async (req, res, next) => {
    try {
        if (!req.userId) return new Error("No ha iniciado sesión")

        const wallet = await Wallet.findOne({ user: req.userId })
        if (!wallet) res.status(400).json("No se ha entrado una billetera")

        res.status(200).json(wallet)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
        next(error)
    }
}



export const bringAllPurchasesByUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const userPurchases = user?.purchases

        const findPostsPurchases = await Publication.find({
            _id: {
                $in: userPurchases
            }
        })

        const postsPurchases = findPostsPurchases.sort((a, b) => {
            if (a.createdAt < b.createdAt) return 1;
            return -1;
        })

        res.status(200).json(postsPurchases)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
        next(error)
    }
}
