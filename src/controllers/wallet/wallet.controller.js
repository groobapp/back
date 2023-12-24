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

        const postToBuy = await Publication.findById(postId)
        if (!postToBuy) {
            return res.status(404).json({ message: 'El post no existe.' });
        }

        if (postToBuy.userIdCreatorPost === userBuyer._id) {
            return res.status(404).json({ message: 'No puedes autocomprarte.' });
        }

        if (walletBuyer.balance < postToBuy.price) {
            return res.status(400).json({ message: 'Saldo insuficiente para adquirir el contenido.' });
        }

        const creatorContent = await User.findById(postToBuy.userIdCreatorPost)
        const walletCreatorContent = Wallet.findOne({ user: postToBuy.userIdCreatorPost })

        if (!creatorContent || !walletCreatorContent) {
            return res.status(404).json({ message: 'Creador de contenido y/o su wallet no han sido encontrados.' });
        }

        walletBuyer.balance = walletBuyer.balance - postToBuy.price
        walletCreatorContent.balance = walletCreatorContent.balance + postToBuy.price

        const coinsTransferred = {
            amount: postToBuy.price,
            receiver: creatorContent.userName,
        };
        const coinsReceived = {
            amount: postToBuy.price,
            sender: userBuyer.userName,
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
        console.log(error)
        res.status(500).json({ error: error });
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
