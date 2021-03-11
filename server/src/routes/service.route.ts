import { Router } from 'express'
import { IdDto } from '../dtos/id.dto'
import Route from '../interfaces/routes.interface'
import { DiscordBotDto } from '../dtos/discord-bot.dto'
import authMiddleware from '../middlewares/auth.middleware'
import ServiceController from '../controllers/service.controller'
import validationMiddleware from '../middlewares/validation.middleware'
import { SubServiceDto } from '../dtos/subService.dto'

class ServiceRoute implements Route {
    public router = Router()
    public serviceC = new ServiceController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/services', authMiddleware, this.serviceC.getList)
        this.router.post('/subservice', authMiddleware, validationMiddleware(SubServiceDto, 'body'), this.serviceC.addSubService)

        this.router.get('/service', authMiddleware, validationMiddleware(IdDto, 'query'), this.serviceC.get)
        this.router.delete('/service', authMiddleware, validationMiddleware(IdDto, 'query'), this.serviceC.delete)
        this.router.post('/service/discordBot', authMiddleware, validationMiddleware(DiscordBotDto), this.serviceC.addDiscordBot)
    }
}

export default ServiceRoute
