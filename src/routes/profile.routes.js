import { Router } from 'express'
import {
    getProfile, deleteProfile, updateProfile, pictureProfile, getProfileById,
    getAllProfiles
} from '../controllers/profile/profile.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';
import multer from "../libs/multer.js"

const router = Router()

router.get('/profile', TokenValidator, getProfile)
router.get('/profile/:id', TokenValidator, getProfileById)
router.get('/profiles', getAllProfiles)

router.put('/profile/:id', TokenValidator, updateProfile)

router.put('/picture', TokenValidator,
    multer.fields([{ name: 'image', maxCount: 1 }]), pictureProfile)

router.delete('/profile', TokenValidator, deleteProfile)



export default router;