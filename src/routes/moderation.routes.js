import { Router } from 'express'
import { createDenouncePost, updateDenouncePost, getDenouncePost, deleteDenouncePost } from '../controllers/admin/moderatePublications.controller.js'
import {  createDenounceUser, updateDenounceUser, getDenounceUser, deleteDenounceUser } from '../controllers/admin/moderateUsers.controllers.js'
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.get('/post/denounce/:id', getDenouncePost) //cambiar a getAllDenouncePosts
router.post('/post/denounce/:id', TokenValidator, createDenouncePost)
router.put('/post/denounce/:id', TokenValidator, updateDenouncePost)
router.delete('/post/denounce/:id', TokenValidator, deleteDenouncePost)

router.get('/post/denounce/:id', TokenValidator, getDenounceUser) 
//cambiar a getAllDenounceUsers usando de ejemplo discoverUsers
router.post('/post/denounce/:id', TokenValidator, createDenounceUser)
router.put('/post/denounce/:id', TokenValidator, updateDenounceUser)
router.delete('/post/denounce/:id', TokenValidator, deleteDenounceUser)


export default router;
