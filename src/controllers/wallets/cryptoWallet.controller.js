import { closeConnectionInMongoose } from '../../libs/constants.js';
import User from "../../models/User.js"
import Crypto from "../../models/Crypto.js"

export const createCryptoWallet = async (req, res, next) => {
    try {
        const { entity, CBU, CVU, alias } = req.body
        const userCBU = parseInt(CBU)
        const userCVU = parseInt(CVU)
        console.log(entity, userCBU, userCVU, alias)

        const user = await User.findById(req.userId)

        const newFiat = new Crypto({ entity, CBU, CVU, alias })
        console.log(newFiat)

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

export const getCryptoWallet = async (req, res) => {
    try {
        const profileData = await User.findById(req.userId, { password: 0 })

        const allWalletsFiat = profileData?.fiatWallets

        const wallets = await Crypto.find({
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