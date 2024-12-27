import express from "express"
import { PostController } from "@/controllers/post-controller"
import { UserController } from "@/controllers/user-controller"
import { authenticateToken } from "@/middleware/auth"


export const router = express.Router()
// Routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, UserController.updateUser)
// Posts
router.post('/posts', authenticateToken, PostController.createPost)
router.get('/posts', PostController.getAllPosts)
router.get('/posts/:id', PostController.getPostById)
router.put('/posts/:id', authenticateToken, PostController.updatePost)
router.delete('/posts/:id', authenticateToken, PostController.deletePost)
