import { Router } from 'express'
import { notification, getNotifications, getNotificationsLength } from '../controllers/notifications/notifications.controller.js'
import { TokenValidator } from '../libs/tokenValidator.js';

const router = Router()

router.post('/notification', TokenValidator, notification)
router.get('/notification', TokenValidator, getNotifications)
router.get('/notification/length', TokenValidator, getNotificationsLength)

export default router;
