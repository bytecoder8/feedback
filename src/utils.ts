import jwt from 'jsonwebtoken'

export function generateTokens({ userId } : { userId: string }, jwtSecret: string, expiresIn: string | number) {
  return {
    accessToken: jwt.sign({ userId }, jwtSecret, {
      expiresIn
    }),
    refreshToken: null
  }
}
