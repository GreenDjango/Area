import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth.service'
import { CreateUserDto } from '../dtos/users.dto'
import { IUser } from '../models/users.model'

class AuthController {
    public authService = new AuthService()

    public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: CreateUserDto = req.body
            await this.authService.signup(userData)
            const { cookie } = await this.authService.login(userData)

            res.setHeader('Set-Cookie', [cookie])
            res.status(200).json({ message: 'signup' })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: CreateUserDto = req.body
            const { cookie } = await this.authService.login(userData)

            res.setHeader('Set-Cookie', [cookie])
            res.status(200).json({ message: 'login' })
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController
