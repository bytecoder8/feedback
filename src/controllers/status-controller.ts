import { prisma } from "@/lib/prisma-client"
import type { Request, Response } from "express"


export const StatusController = {
  async getAll(req: Request, res: Response) {
    const statuses = await prisma.status.findMany()
    return res.json(statuses)
  }
}
