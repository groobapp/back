import { Router } from 'express'
import { createDenouncePost, getDenouncePost, updateDenouncePost, deleteDenouncePost } from '../controllers/admin/moderatePublications.controller.js';
import { createDenounceUser, getDenounceUser, updateDenounceUser, deleteDenounceUser } from '../controllers/admin/moderateUsers.controllers.js';
import { getWalletsWithWithdrawlRequests } from '../controllers/admin/withdrawalRequests.controller.js';
const router = Router()

// publicaciones
router.post('/create-denounce-post', createDenouncePost)
router.get('/get-denounce-posts', getDenouncePost)
router.put('/update-denounce-post', updateDenouncePost)
router.delete('/delete-denounce-post', deleteDenouncePost)

// usuarios
router.post('/create-denounce-user', createDenounceUser)
router.get('/get-denounce-users', getDenounceUser)
router.put('/update-denounce-user', updateDenounceUser)
router.delete('/delete-denounce-user', deleteDenounceUser)

//wallets
router.get('/get-withdrawl-requests', getWalletsWithWithdrawlRequests)


export default router;