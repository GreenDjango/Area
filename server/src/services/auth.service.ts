import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isEmpty } from '../utils/util'
import { CreateUserDto } from '../dtos/users.dto'
import HttpException from '../exceptions/HttpException'
import { createUser, getUser, IUser } from '../models/users.model'
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface'

class AuthService {
    public async signup(userData: CreateUserDto): Promise<IUser> {
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

        const findUser = await getUser(userData.email)
        if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`)

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const createUserData = await createUser(userData.email, hashedPassword).catch(function (err) {
            console.error(err)
            throw new HttpException(500, 'Internal error')
        })
        return createUserData
    }

    public async login(user: CreateUserDto, service = false, onlyLogin = false): Promise<{ cookie: string; findUser: IUser }> {
        if (isEmpty(user)) throw new HttpException(400, "You're not userData")

        let findUser = await getUser(user.email, service)
        if (!findUser) {
            if (service && !onlyLogin) findUser = await createUser(user.email, user.password, true)
            else if (service && onlyLogin) throw new HttpException(403, '[Auth] - Incomplete bearer token')
            else throw new HttpException(409, `You're email ${user.email} not found`)
        } else if (findUser.loginWithService) {
            if (findUser.password !== user.password) throw new HttpException(403, '[Auth] - Invalid service')
        } else {
            const isPasswordMatching: boolean = await bcrypt.compare(user.password, findUser.password)
            if (!isPasswordMatching) throw new HttpException(409, "You're password not matching")
        }

        const tokenData = this.createToken(findUser)
        const cookie = this.createCookie(tokenData)

        return { cookie, findUser }
    }

    public createToken(user: IUser): TokenData {
        const dataStoredInToken: DataStoredInToken = { id: user._id }
        const secret: string = process.env.JWT_SECRET
        const expiresIn: number = 60 * 60 * 12

        return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) }
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; SameSite=Strict; Max-Age=${tokenData.expiresIn};`
    }
}

export default AuthService
