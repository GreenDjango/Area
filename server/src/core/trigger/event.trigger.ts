import ATrigger from '../../interfaces/trigger.interface'
import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'

// ? IN
// num
// ? Out
export default class EventTask extends ATrigger {
    res = new Map<string, any>()
    intervalObj: NodeJS.Timeout

    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.EVENT, data, input)
    }

    public async _run(): Promise<properties> {
        return this.res
    }

    public init(callback: (trigger: ATask) => Promise<void>) {
        const timeS = this.data.get('num')
        if (!timeS) throw 'Invalid Time'
        const wait = Math.floor((new Date(timeS * 1000).getTime() - Date.now()) / 1000)
        if (wait < 0) throw 'Old date'

        this.intervalObj = setTimeout(async () => {
            callback(this as ATask)
            this.lastExecuted = new Date()
        }, wait * 1000)
    }

    public stop() {
        return
    }
}
