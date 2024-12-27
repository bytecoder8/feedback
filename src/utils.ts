import jwt from 'jsonwebtoken'

export function generateTokens({ userId } : { userId: string }, jwtSecret: string) {
  return {
    accessToken: jwt.sign({ userId }, jwtSecret),
    refreshToken: null
  }
}
