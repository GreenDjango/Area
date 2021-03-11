import { Router } from 'express'
import { CreateUserDto } from '../dtos/users.dto'
import Route from '../interfaces/routes.interface'
import AuthController from '../controllers/auth.controller'
import validationMiddleware from '../middlewares/validation.middleware'

class AuthRoute implements Route {
    public router = Router()
    public authController = new AuthController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/signup', validationMiddleware(CreateUserDto, 'body'), this.authController.signUp)
        this.router.post('/login', validationMiddleware(CreateUserDto, 'body'), this.authController.logIn)
    }
}

export default AuthRoute
