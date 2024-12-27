import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import logger from 'morgan'
import 'dotenv/config'
import 'module-alias/register'

import { router } from '@/routes/api/v1'



const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/api', router)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send('Internal server error')
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
