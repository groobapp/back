import { closeConnectionInMongoose } from '../../libs/constants.js';
import User from "../../models/User.js"
import Fiat from "../../models/Fiat.js"

export const createFiatWallet = async (req, res, next) => {
    try {
        const { entity, CBU, CVU, alias } = req.body

        const user = await User.findById(req.userId)
        const newFiat = new Fiat({ entity, CBU, CVU, alias })
        const result = await newFiat.save()
        const FiatId = result?._id
        if (user != undefined) {
            user.fiatWallets = user.fiatWallets.concat(FiatId)
        }
        await user.save()
        res.status(200).json(result)
        return closeConnectionInMongoose

    } catch (error) {
        console.error(error)
        res.status(500).json(error)
        next()
    }
}

export const getFiatWallet = async (req, res) => {
    try {
        const profileData = await User.findById(req.userId, { password: 0 })
        const allWalletsFiat = profileData?.fiatWallets
        const wallets = await Fiat.find({
            _id: {
                $in: allWalletsFiat
            }
        })
        res.status(200).json(wallets)
        return closeConnectionInMongoose
    } catch (error) {
        console.log("error:", error)
         res.status(404).json(error)
         next()
    }
}

export const updateFiatWallet = async (req, res) => {
    try {
        const { entity, CBU, CVU, alias } = req.body;
        const { id } = req.params
        const wallet = await Fiat.findById(id, { password: 0 })
        await Fiat.findByIdAndUpdate(
            { _id: wallet._id },
            { entity, CBU, CVU, alias })
        res.status(200).json({ message: "Wallet updated!" });
        return closeConnectionInMongoose
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next()
    }
}
