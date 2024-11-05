import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { rateLimit } from 'express-rate-limit'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 40,
    standardHeaders: true,
    legacyHeaders: false,
    validate: {xForwardedForHeader: false}
})

app.use(cookieParser())
app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }))
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(json({ limit: '50kb' }))
app.use(urlencoded({ extended: true }))
app.use(limiter)
app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
