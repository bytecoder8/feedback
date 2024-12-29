import jwt from 'jsonwebtoken'

export function generateTokens({ userId } : { userId: string }, jwtSecret: string, expiresIn: string) {
  return {
    accessToken: jwt.sign({ userId }, jwtSecret, {
      expiresIn
    }),
    refreshToken: null
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
