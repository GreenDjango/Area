import { RequestWithUser } from '../interfaces/auth.interface'
import { NextFunction, Request, Response } from 'express'
import { addServiceToUser } from '../models/users.model'
import HttpException from '../exceptions/HttpException'
import GoogleService from '../services/google.service'
import { IOAuthCredentials } from '../models/oauthCredentials.model'

export default class OAuth2Controller {
    public googleService = new GoogleService()

    public googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const state = (req.query.state as string).split(';')

            switch (state[0]) {
                case 'googleService':
                    req.cookies.Authorization = state[1]
                    next()
                    break
                case 'googleLogin':
                    await this.googleLogIn(req, res)
                    break
            }
        } catch (err) {
            next(err)
        }
    }

    private googleLogIn = async (req: Request, res: Response) => {
        try {
            const oauthToken = await this.googleService.exchangeCode(req.query.code, true)
            const { cookie } = await this.googleService.logIn(oauthToken)

            const credentials = cookie.split(';')[0].split('=')
            console.log(cookie)
            res.cookie(credentials[0], credentials[1])
            res.redirect(`http://localhost:8081/#/dashboard`)
        } catch (err) {
            console.error(err)
            res.redirect(`http://localhost:8081/#/login?error=${err}`)
        }
    }

    public googleAddService = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = req.user

            if (user.services.find((service) => service.name === 'google'))
                throw new HttpException(409, `Google service already linked`)

            const tokens: IOAuthCredentials = await this.googleService.exchangeCode(req.query.code)
            await addServiceToUser(user, tokens)
            res.redirect(`http://localhost:8081/#/account`)
        } catch (err) {
            next(err)
        }
    }
}
