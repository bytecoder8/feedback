import express from "express"
import z from 'zod'
import validate from "@/lib/zod-express-validator"
import { UserController } from "@/controllers/user-controller"
import { authenticateToken } from "@/middleware/auth"
import { loginSchema, registerSchema, updateSchema } from "@/schemas/user"


export const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 */

router.post('/register', validate({
  body: registerSchema
}), UserController.register)

router.post('/login', validate({
  body: loginSchema
}), UserController.login)

router.put('/users/:id', authenticateToken, validate({
  params: { id: z.string() },
  body: updateSchema
}), UserController.updateUser)

router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken, UserController.getUserById)
