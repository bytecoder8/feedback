import express from 'express'
import cors from 'cors'
import logger from 'morgan'


require('dotenv').config()

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.get('/', (req, res) => {
  return res.send('Hello, World!')
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
