import type { Request, Response } from "express"
import bcrypt from 'bcrypt'

import { prisma } from "@/lib/prisma-client"
import config from "@/config"
import { LoginUser, RegisterUser, UpdateUser, publicUserSchema } from '@/schemas/user'
import { generateTokens } from "@/utils"


const UserController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, avatar } = req.body as RegisterUser

      const existingUser = await prisma.user.findUnique({where: { email }})
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          avatar
        }
      })
      const tokens = generateTokens({ userId: user.id }, config.jwtSecretKey, config.jwtAccessTokenExpiresIn)

      return res.json({ user: publicUserSchema.parse(user), tokens })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async login(req: Request, res: Response) {
    try {
      let { email, password } = req.body as LoginUser

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return res.status(400).json({ error: "Incorrect user or password" })
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Incorrect user or password" })
      }
  
      const tokens = generateTokens({userId: user.id}, config.jwtSecretKey, config.jwtAccessTokenExpiresIn)
      return res.json({ user: publicUserSchema.parse(user), tokens })
    } catch (error) {
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
      return res.json(publicUserSchema.parse(user))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  },
  async getUserById(req: Request, res: Response) {
    const { id } = req.params
    
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }

      return res.json(publicUserSchema.parse(user))
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
      const { email, avatar } = req.body as UpdateUser
      
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
          avatar: avatar || undefined
        }
      })
      return res.json(publicUserSchema.parse(user))
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal server error" })
    }
  }
}


export { 
  UserController
}
