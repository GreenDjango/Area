import { google } from 'googleapis'
import CONFIG from '../../config'
import { IUser } from '../../models/users.model'

export default class GoogleYoutubeService {
    public static getYoutubeClient(user: IUser) {
        const tokens = user.services.find((s) => s.name === 'google')
        if (!tokens) throw '[Youtube] - Service google not linked'
        const auth = new google.auth.OAuth2(CONFIG.oauth2.google.client_id, CONFIG.oauth2.google.client_secret)
        auth.setCredentials(tokens)
        return google.youtube({ version: 'v3', auth: auth })
    }

    // https://developers.google.com/youtube/v3/docs
}
