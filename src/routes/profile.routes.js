import { Router } from 'express'
import { getProfile, deleteProfile, updateProfile, pictureProfile, getProfileById, 
    getAllProfiles, getAllPostsByUser, getReducedUser, getReducedUserById } from '../controllers/profile.controller.js';
import { TokenValidator } from '../libs/tokenValidator.js';
// import { schemaValidation } from '../libs/schemasValidator.js';
// import { UpdateProfileSchema, ValidateProfileParamsSchema } from '../schemas/profile.schema';
import multer from "../libs/multer"

const router = Router()

router.get('/profile', TokenValidator, getProfile)
router.get('/profile/:id', TokenValidator, getProfileById)
router.get('/profile/posts', TokenValidator, getAllPostsByUser) // trae absolutamente todos los posts del usuario.
router.get('/profiles', getAllProfiles)
router.get('/profile-reduced', TokenValidator, getReducedUser)
router.get('/profiles-reduced/:id', TokenValidator, getReducedUserById)

router.put('/profile/:id', TokenValidator, updateProfile)

router.put('/picture/:id', TokenValidator, 
multer.fields([{name: 'image',maxCount: 1}]), pictureProfile)

router.delete('/profile/:id', TokenValidator, deleteProfile)



export default router;