import { IOAuthCredentials, OAuthCredentialsModel } from '../models/oauthCredentials.model'
import { addServiceToUser, IUser } from '../models/users.model'
import HttpException from '../exceptions/HttpException'
import AuthService from '../services/auth.service'
import { CreateUserDto } from '../dtos/users.dto'
import { isEmpty } from '../utils/util'
import queryString from 'query-string'
import { google } from 'googleapis'
import CONFIG from '../config'
import axios from 'axios'

export default class GoogleService {
    public authService = new AuthService()

    public async exchangeCode(code: any, login = false): Promise<IOAuthCredentials> {
        if (isEmpty(code) || typeof code !== 'string') throw new HttpException(400, '[GoogleAPI] - Empty OAuthCode')

        return axios
            .post(
                'https://oauth2.googleapis.com/token',
                queryString.stringify({
                    code: code,
                    client_id: CONFIG.oauth2.google.client_id,
                    client_secret: CONFIG.oauth2.google.client_secret,
                    redirect_uri: CONFIG.oauth2.google.redirect_uri,
                    grant_type: 'authorization_code',
                })
            )
            .then((res) => {
                const data = res.data
                if (!data.access_token || (!login && !data.refresh_token) || !data.expires_in) {
                    throw new HttpException(403, '[GoogleAPI] - Incomplete bearer token')
                }
                const credentials: IOAuthCredentials = new OAuthCredentialsModel({
                    name: 'google',
                    access_token: res.data.access_token,
                    refresh_token: res.data.refresh_token,
                    expires_in: new Date(Date.now() + res.data.expires_in * 1000),
                })
                return credentials
            })
    }

    public async logIn(tokens: IOAuthCredentials): Promise<{ user: IUser; cookie: string }> {
        const auth = new google.auth.OAuth2()
        auth.setCredentials(tokens)
        const api = google.oauth2({ version: 'v2', auth: auth })

        const profile = await api.userinfo.get().then((res) => res.data)
        if (!profile) throw new HttpException(500, `[GoogleAPI] - Unable to receive user's email`)

        const userData: CreateUserDto = { email: profile.email, password: 'google' }
        const { cookie, findUser } = await this.authService.login(userData, true, isEmpty(tokens.refresh_token))
        const user = await addServiceToUser(findUser, tokens)
        return { user, cookie }
    }
}
