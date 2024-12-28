import express from "express"
import { router as posts } from "./posts"
import { router as users } from "./users"


export const router = express.Router()

router.use('/', users)
router.use('/', posts)
