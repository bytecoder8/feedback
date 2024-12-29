import { prisma } from "@/lib/prisma-client"
import type { Request, Response } from "express"


export const CategoryController = {
  async getAll(req: Request, res: Response) {
    const categories = await prisma.category.findMany()
    return res.json(categories)
  }
}
