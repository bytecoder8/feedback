import { UserController } from "@/controllers/user-controller"
import { authenticateToken } from "@/middleware/auth"
import express from "express"


export const router = express.Router()
// Routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, UserController.updateUser)
