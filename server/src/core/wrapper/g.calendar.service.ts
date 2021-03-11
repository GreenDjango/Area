import { google } from 'googleapis'
import CONFIG from '../../config'
import { IUser } from '../../models/users.model'

export default class googleCalendarService {
    private static getCalendarClient(user: IUser) {
        const tokens = user.services.find((s) => s.name === 'google')
        if (!tokens) throw '[Calendar] - Service google not linked'
        const auth = new google.auth.OAuth2(CONFIG.oauth2.google.client_id, CONFIG.oauth2.google.client_secret)
        auth.setCredentials(tokens)
        return google.calendar({ version: 'v3', auth: auth })
    }

    public static async listUpcomingEvents(user: IUser): Promise<any> {
        const calendar = this.getCalendarClient(user)

        return calendar.events
            .list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: 'startTime',
            })
            .then((res) => {
                return res.data?.items
            })
    }

    // public async addEvent(user: IUser): Promise<any> {
    //     const calendar = this.getCalendarClient(user)

    //     const event = {
    //         summary: 'Google I/O 2015',
    //         location: '800 Howard St., San Francisco, CA 94103',
    //         description: "A chance to hear more about Google's developer products.",
    //         start: {
    //             dateTime: '2015-05-28T09:00:00-07:00',
    //             timeZone: 'America/Los_Angeles',
    //         },
    //         end: {
    //             dateTime: '2015-05-28T17:00:00-07:00',
    //             timeZone: 'America/Los_Angeles',
    //         },
    //         recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    //         attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
    //         reminders: {
    //             useDefault: false,
    //             overrides: [
    //                 { method: 'email', minutes: 24 * 60 },
    //                 { method: 'popup', minutes: 10 },
    //             ],
    //         },
    //     }

    //     calendar.events
    //         .insert({
    //             calendarId: 'primary',
    //             requestBody: event,
    //         })
    //         .then((res) => {
    //             console.log(res)
    //         })
    //         .then(() => {
    //             throw 'Not implemented'
    //         })
    // }
}

// scope https://developers.google.com/calendar/auth?hl=fr
