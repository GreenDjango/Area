import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'
import { IUser } from '../../models/users.model'
import GoogleCalendarService from '../wrapper/g.calendar.service'

// ? OUT
// commingEvent
export default class CalendarCommingEventTask extends ATask {
    private _user: IUser

    constructor(id: number, data: properties, input: socketIN[], user: IUser) {
        super(id, taskList.CALENDAR_COMMING_EVENT, data, input)
        this._user = user
    }

    public async _run(dep: properties): Promise<properties> {
        try {
            // const urlID: string = tmpId[7]
            const calendarEvent = await GoogleCalendarService.listUpcomingEvents(this._user)
            let event = 'empty'
            if (calendarEvent && calendarEvent !== [] && calendarEvent[0]) {
                const info = calendarEvent[0]
                event = `[${info.start?.dateTime}->${info.end?.dateTime}] - ${info.summary}`
            }
            return new Map<string, any>([['event', event]])
        } catch (err) {
            console.log(err)
        }
    }
}
