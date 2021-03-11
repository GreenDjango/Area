import ATrigger from '../../interfaces/trigger.interface'
import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'

// ? IN
// timeMS
// ? Out
export default class onTimerTask extends ATrigger {
    res = new Map<string, any>()
    intervalObj: NodeJS.Timeout

    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.TIMER, data, input)
    }

    public async _run(): Promise<properties> {
        this.lastExecuted = new Date()
        return this.res
    }

    public init(callback: (trigger: ATask) => Promise<void>) {
        const timeMs = this.data.get('num')
        if (!timeMs) throw 'Invalid Time'
        this.intervalObj = setInterval(async () => {
            callback(this as ATask)
            this.lastExecuted = new Date()
        }, timeMs * 1000)
    }

    public stop() {
        clearInterval(this.intervalObj)
    }
}
