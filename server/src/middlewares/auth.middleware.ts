import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import HttpException from '../exceptions/HttpException'
import { DataStoredInToken, RequestWithUser } from '../interfaces/auth.interface'
import { getUserById, IUser } from '../models/users.model'

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const cookies = req.cookies

        if (cookies && cookies.Authorization) {
            const secret = process.env.JWT_SECRET
            const verificationResponse = (await jwt.verify(cookies.Authorization, secret)) as DataStoredInToken
            const userId = verificationResponse.id
            getUserById(userId).then((User: IUser) => {
                req.user = User
                next()
            })
        } else {
            next(new HttpException(404, 'Authentication token missing'))
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'))
    }
}

export default authMiddleware
