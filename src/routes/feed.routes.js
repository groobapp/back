import { Router } from 'express'
import { createPost, getPostById, getAllPosts, updatePostById, deletePost } from '../controllers/posts/posts.controller.js';
// import { TokenValidator } from '../libs/tokenValidator.js';
import multer from "../libs/multer.js"
// import { schemaValidation } from '../libs/schemasValidator';
// import { CreatePublicationSchema, GetOrDeletePublicationByIdSchema } from '../schemas/publications.schema';
const router = Router()

router.post('/post', multer.fields([{
    name: 'images',
    maxCount: 20
}]), createPost)

router.get('/post/:id', getPostById)
router.get('/posts', getAllPosts)

router.put('/post/:id', updatePostById)
router.delete('/post/:id', deletePost)

export default router;
