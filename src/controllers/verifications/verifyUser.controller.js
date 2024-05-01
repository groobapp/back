import User from '../../models/User.js'
import Publication from '../../models/Publication.js'
import fs from "fs-extra"
import { uploadImage } from "../../libs/cloudinary.js";

export const frontDNI = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id, { password: 0 })
        if (req.files) {
            const files = req.files['image']
            if (files) {
                for (const file of files) {
                    const result = await uploadImage({ filePath: file.path })
                    obj = {
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                    }
                    await fs.unlink(file.path)
                }
            }
        }
        if (user !== undefined) {
            const userUpdated = await user.save()
            userUpdated.verificationInProcess = true
            await Publication.updateMany({ userName: user.userName }, { profilePicture: pictureUpdated.secure_url})
            res.status(200).json({ pictureUpdated });
        }
    } catch (error) {
        console.log("Error:", error)
        res.status(500).json(error)
        next()
    }
}