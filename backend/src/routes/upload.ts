import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware from '../middlewares/file'
import express from 'express'

const uploadRouter = Router()
uploadRouter.use(express.json({limit: '10Mb'}))
uploadRouter.post('/', fileMiddleware.single('file'), uploadFile)

export default uploadRouter

