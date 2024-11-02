import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { rateLimit } from 'express-rate-limit'

const { PORT = 3000 } = process.env
const app = express()
const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(cookieParser())
app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }))
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(urlencoded({ extended: true }))
app.use(json({ limit: '10kb' }))
app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        app.use(limiter)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
