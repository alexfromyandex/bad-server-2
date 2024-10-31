import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${uuidv4() + path.extname(req.file.originalname)}`
            : `/${uuidv4() + path.extname(req.file.originalname)}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            //fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}

