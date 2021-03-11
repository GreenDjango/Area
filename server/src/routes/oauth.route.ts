import { Router } from 'express'
import Route from '../interfaces/routes.interface'
import authMiddleware from '../middlewares/auth.middleware'
import OAuth2Controller from '../controllers/oauth.controller'

class OAuthRoute implements Route {
    public router = Router()
    public oauthController = new OAuth2Controller()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(
            '/oauth/google',
            this.oauthController.googleCallback,
            authMiddleware,
            this.oauthController.googleAddService
        )
    }
}

export default OAuthRoute
