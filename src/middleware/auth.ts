import type { RequestHandler } from 'express'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { type UserPayload, userPayloadSchema } from '../types'
import config from '../config'


const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(403).json({ error: "Unauthorized: No token provided" })
  }

  jwt.verify(token, config.jwtSecretKey, (err, user) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ error: "Access Token expired" })
      } else {
        return res.status(401).json({ error: "Invalid Token" })
      }
    }
    const validationResult = userPayloadSchema.safeParse(user)
    if (!validationResult.success) {
      return res.status(403).json({ error: "Invalid Token" })
    }
    res.locals.user = user as UserPayload

    next()
  })
}

export {
  authenticateToken
}
