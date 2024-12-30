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
 *           type: [string, 'null']
 *         created_at:
 *           type: string
 *           format: date
 * 
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - confirm
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         confirm:
 *           type: string
 *         avatar:
 *           type: string
 * 
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken: string
 *         refreshToken: null
 */

/**
 * @swagger
 * /register:
 *  post:
 *     requestBody:
 *         in: body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRegister'
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  type: 
 *                    object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *                    tokens:
 *                      $ref: '#/components/schemas/Tokens'
 */
router.post('/register', validate({
  body: registerSchema
}), UserController.register)

/**
 * @swagger
 * /login:
 *  post:
 *     requestBody:
 *         in: body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogin'
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  type: 
 *                    object
 *                  properties:
 *                    user:
 *                      $ref: '#/components/schemas/User'
 *                    tokens:
 *                      $ref: '#/components/schemas/Tokens'
 */
router.post('/login', validate({
  body: loginSchema
}), UserController.login)

/**
 * @swagger
 * /users/{id}:
 *  put:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *         in: body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdate'
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/User'
 */
router.put('/users/:id', authenticateToken, validate({
  params: { id: z.string() },
  body: updateSchema
}), UserController.updateUser)

/**
 * @swagger
 * /profile:
 *  get:
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/User'
 */
router.get('/profile', authenticateToken, UserController.current)

/**
 * @swagger
 * /users/{id}:
 *  get:
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                    $ref: '#/components/schemas/User'
 */
router.get('/users/:id', authenticateToken, UserController.getUserById)
