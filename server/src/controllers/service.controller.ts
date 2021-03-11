import { NextFunction, Response } from 'express'
import { DiscordBotDto } from '../dtos/discord-bot.dto'
import HttpException from '../exceptions/HttpException'
import { addServiceToUser } from '../models/users.model'
import { RequestWithUser } from '../interfaces/auth.interface'
import { IOAuthCredentials, OAuthCredentialsModel } from '../models/oauthCredentials.model'
import { SubServiceDto } from '../dtos/subService.dto'

class ServiceController {
    public addSubService = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            let user = req.user
            const data: SubServiceDto = req.body

            let subServices = user.services.find((s) => s.name === 'SubServices')
            if (!subServices) {
                const credentials: IOAuthCredentials = new OAuthCredentialsModel({
                    name: 'SubServices',
                    access_token: '[]',
                })
                user = await addServiceToUser(user, credentials)
                subServices = user.services.find((s) => s.name === 'SubServices')
            }
            const array = new Map<string, boolean>(JSON.parse(subServices.access_token))
            array.set(data.name, data.enable)
            subServices.access_token = JSON.stringify(Array.from(array.entries()))
            user = await user.save()
            res.status(200).json({ data: user.services, message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

    public getList = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user

            res.status(200).json({ data: user.services, message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

    public addDiscordBot = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user
            const serviceName = 'discord-bot'
            const token: DiscordBotDto = req.body
            const target = user.services.find((s) => s.name === serviceName)
            if (target) {
                target.access_token = token.token
                await user.save()
            } else {
                const credentials: IOAuthCredentials = new OAuthCredentialsModel({
                    name: serviceName,
                    access_token: token.token,
                })
                await addServiceToUser(user, credentials)
            }

            res.status(200).json({ data: user.services, message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

    public get = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user
            const id = req.query['id']

            const service = user.services.find((s) => s._id == id)
            if (!service) throw new HttpException(404, `Service not found`)

            res.status(200).json({ data: service, message: 'OK' })
        } catch (error) {
            next(error)
        }
    }

    public delete = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user
            const id = req.query['id']

            let target = undefined
            const services = user.services.filter((s) => {
                if (s._id != id) return true
                target = s
                return false
            })
            if (!target) throw new HttpException(404, 'Service not found')

            // TODO oauth service (refresh token) -> Disconnect

            user.services = services
            await user.save()
            res.status(200).json({ message: 'OK' })
        } catch (error) {
            next(error)
        }
    }
}

export default ServiceController
