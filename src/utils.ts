import jwt from 'jsonwebtoken'

export function generateTokens({ userId } : { userId: string }, jwtSecret: string, expiresIn: string) {
  return {
    accessToken: jwt.sign({ userId }, jwtSecret, {
      expiresIn
    }),
    refreshToken: null
  }
}
