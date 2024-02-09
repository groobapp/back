import User from '../../models/User.js'
import Wallet from '../../models/Wallet.js'
import Publication from '../../models/Publication.js'

export const createWithdrawalRequest = async (req, res, next) => {
    try {
        const { amountCoins, amountMoney, currency, accountSelected, paymentFee, comisionGroob } = req.body
        if (isNaN(amountCoins) || amountCoins <= 0) {
            return res.status(400).json({ error: "Cantidad de monedas no válida" });
        }
        if (isNaN(amountMoney) || amountMoney <= 0) {
            return res.status(400).json({ error: "Cantidad de dinero no válida" });
        }
        if (!currency || currency.length !== 3) {
            return res.status(400).json({ error: "Divisa no válida" });
        }
        const wallet = await Wallet.findOne({ user: req.userId })
        if (!wallet) {
            return res.status(404).json({ message: 'Billetera no encontrada.' });
        }

        wallet.withdrawalRequests.push({
            amountCoins,
            amountMoney,
            currency,
            accountSelected,
            paymentFee,
            comisionGroob,
        })
        wallet.balance = 0
        await wallet.save()
        res.status(200).json("Solicitud de retiro creada!")
    } catch (error) {
        console.log(error)
        res.status(403).json(error);
        next(error)
    }
}


export const buyContentById = async (req, res, next) => {
    try {
        const { postId } = req.body
        if (!postId) {
            return res.status(404).json({ message: 'No se ha recibido un ID.' });
        }
        const userBuyer = await User.findById(req.userId)
        const myPostsIds = userBuyer.publications.map(pub => pub._id);

        if (myPostsIds.includes(postId)) {
            console.log("estás intentando autocomprarte")
            return res.status(400).json("No puedes autocomprarte.")
        }

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

        const creatorContent = await User.findById({ _id: postToBuy.userIdCreatorPost })

        if (!creatorContent) {
            return res.status(404).json({ message: 'Creador de contenido no encontrado.' });
        }

        const walletCreatorContent = await Wallet.findById({ _id: creatorContent.wallet })
        if (!walletCreatorContent) {
            return res.status(404).json({ message: 'Billetera del creador no encontrada.' });
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

        await userBuyer.save()
        await postToBuy.save()
        await walletBuyer.save()
        await walletCreatorContent.save()


        res.status(200).json({ message: "Contenido desbloqueado!" })
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

export const updateWallet = async (req, res, next) => {
    try {

        if (!req.userId) return new Error("No ha iniciado sesión")
        const { balance, promotionUsed, amountCoins, amountMoney, currency, accountSelected, paymentFee, comisionGroob } = req.body

        const wallet = await Wallet.findOne({ user: req.userId })
        if (!wallet) res.status(400).json("No se ha entrado una billetera")

        res.status(200).json(wallet)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
        next(error)
    }
}

export const updateWalletWithPromotion = async (req, res, next) => {
    try {

        if (!req.userId) return new Error("No ha iniciado sesión")
        const { balance, promotionUsed, amountCoins, amountMoney, currency, accountSelected, paymentFee, comisionGroob } = req.body

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
        console.log("userPurchases", userPurchases)

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
