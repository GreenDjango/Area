import { NextFunction, Response } from 'express'
import ActionService from '../services/action.service'
import { RequestWithUser } from '../interfaces/auth.interface'
import HttpException from '../exceptions/HttpException'
import { CreateActionDto, ModifyActionDto } from '../dtos/action.dto'
import { actionManager } from '../core/actionManager'

class ActionController {
    public actionService = new ActionService()

    public create = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: CreateActionDto = req.body
            if (req.user.actions.find((a) => a.name === data.name)) throw new HttpException(409, `This name is already taken`)
            const action = await this.actionService.create(req.user, req.body)
            if (!action) throw new HttpException(500, `Can't create action`)

            actionManager.syncUserAction(req.user)
            res.status(200).json({ message: 'OK', data: { id: action.id } })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    public sync = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            actionManager.syncUserAction(req.user)
            res.status(200).json({ message: 'OK' })
        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    public update = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: ModifyActionDto = req.body

            const action = req.user.actions.find((a) => a._id == data.id)
            if (!action) throw new HttpException(404, `Action not found`)

            await this.actionService.update(req.user, action, data)
            actionManager.syncUserAction(req.user)
            res.status(200).json({ message: 'OK' })
        } catch (err) {
            next(err)
        }
    }

    public delete = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!(await this.actionService.delete(req.user, req.query['id']))) throw new HttpException(404, 'Action not found')
            res.status(200).json({ message: 'OK' })
        } catch (err) {
            next(err)
        }
    }

    public getList = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json({ data: this.actionService.list(req.user), message: 'OK' })
        } catch (err) {
            next(err)
        }
    }

    public get = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const action = this.actionService.get(req.user, req.query['id'])
            if (!action) throw new HttpException(404, `Action not found`)

            res.status(200).json({ data: action, message: 'OK' })
        } catch (err) {
            next(err)
        }
    }
}

export default ActionController
