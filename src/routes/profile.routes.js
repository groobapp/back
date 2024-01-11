import { Router } from 'express'
import {
    getProfile, updateProfile, pictureProfile, getProfileById,
    deleteAccount
} from '../controllers/profile/profile.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';
import multer from "../libs/multer.js"

const router = Router()

router.get('/profile', TokenValidator, getProfile)
router.get('/profile/:id', TokenValidator, getProfileById)

router.put('/profile/:id', TokenValidator, updateProfile)

router.put('/picture', TokenValidator,
    multer.fields([{ name: 'image', maxCount: 1 }]), pictureProfile)

router.delete('/delete-account', TokenValidator, deleteAccount)



export default router;