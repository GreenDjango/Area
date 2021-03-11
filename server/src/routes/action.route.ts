import { Router } from 'express'
import { IdDto } from '../dtos/id.dto'
import Route from '../interfaces/routes.interface'
import authMiddleware from '../middlewares/auth.middleware'
import ActionController from '../controllers/action.controller'
import { CreateActionDto, ModifyActionDto } from '../dtos/action.dto'
import validationMiddleware from '../middlewares/validation.middleware'

class ActionRoute implements Route {
    public router = Router()
    public actionController = new ActionController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/actions', authMiddleware, this.actionController.getList)

        this.router.get('/action', authMiddleware, validationMiddleware(IdDto, 'query'), this.actionController.get)
        this.router.delete('/action', authMiddleware, validationMiddleware(IdDto, 'query'), this.actionController.delete)
        this.router.put('/action', authMiddleware, validationMiddleware(ModifyActionDto, 'body'), this.actionController.update)
        this.router.post('/action', authMiddleware, validationMiddleware(CreateActionDto, 'body'), this.actionController.create)
        this.router.get('/action/sync', authMiddleware, this.actionController.sync)
    }
}

export default ActionRoute
