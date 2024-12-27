import type { Request, Response } from "express"
import bcrypt from 'bcrypt'
import z from 'zod'

import { prisma } from "@/lib/prisma-client"
import config from "@/config"
import { loginSchema, publicUserSchema, registerSchema, updateSchema } from '@/schemas/user'
import { generateTokens } from "@/utils"


const UserController = {
  async register(req: Request, res: Response) {
    try {
      registerSchema.parse(req.body)
      const { email, password } = req.body

      const existingUser = await prisma.user.findUnique({where: { email }})
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        }
      })
      const tokens = generateTokens({ userId: user.id }, config.jwtSecretKey)

      return res.json({ user: publicUserSchema.parse(user), tokens })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          errors: error.issues
        })
      }
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async login(req: Request, res: Response) {
    try {
      loginSchema.parse(req.body)
      let { email, password } = req.body

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(400).json({ error: "Incorrect user or password" })
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Incorrect user or password" })
      }
  
      const tokens = generateTokens({userId: user.id}, config.jwtSecretKey)
      return res.json({ user: publicUserSchema.parse(user), tokens })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          errors: error.issues
        })
      }
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async current(req: Request, res: Response) {
    try {
      const userId = res.locals.user?.userId
      const user = await prisma.user.findUnique({ where: { id: userId } })
      
      if (!user) {
        return res.status(400).json({ error: "Couldn't find the user" })
      }
      return res.json({ ...publicUserSchema.parse(user) })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async getUserById(req: Request, res: Response) {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ error: "id is required" })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true
        }
      })

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      return res.json({ ...publicUserSchema.parse(user) })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    if (id !== res.locals.user?.userId) {
      return res.status(403).json({ error: "Unauthorized" })
    }
    
    try {
      updateSchema.parse(req.body)
      const { email } = req.body
      
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: "Can't change email" })
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
        }
      })
      user['password'] = ''
      return res.json(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error",
          errors: error.issues
        })
      }
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }
}


export { 
  UserController
}
