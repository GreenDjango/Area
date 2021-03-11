import { NextFunction, Request, Response } from 'express'
import aboutModel from '../models/about.model'

class IndexController {
    public index = (req: Request, res: Response, next: NextFunction): void => {
        try {
            res.sendStatus(200)
        } catch (error) {
            next(error)
        }
    }

    public about = (req: Request, res: Response, next: NextFunction): void => {
        try {
            aboutModel.client.host = req.ip
            aboutModel.server.current_time = Math.round(Date.now() / 1000)
            res.status(200).json(aboutModel)
        } catch (error) {
            next(error)
        }
    }
}

export default IndexController
