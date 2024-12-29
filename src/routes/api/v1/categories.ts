import { CategoryController } from "@/controllers/category-controller"
import express from "express"


export const router = express.Router()

router.get('/categories', CategoryController.getAll)
