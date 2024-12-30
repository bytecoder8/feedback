import { StatusController } from "@/controllers/status-controller"
import express from "express"


export const router = express.Router()

/**
 * @openapi
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /statuses:
 *   get:
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *           content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Status'
 */
router.get('/statuses', StatusController.getAll)
