import ATrigger from '../../interfaces/trigger.interface'
import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'

// ? IN
// timeMS
// ? Out
export default class CooldownTask extends ATrigger {
    res = new Map<string, any>()
    intervalObj: NodeJS.Timeout

    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.COOLDOWN, data, input)
    }

    public async _run(): Promise<properties> {
        return this.res
    }

    public init(callback: (trigger: ATask) => Promise<void>) {
        const timeS = this.data.get('num')
        if (!timeS) throw 'Invalid Time'
        this.intervalObj = setTimeout(async () => {
            this.lastExecuted = new Date()
            callback(this as ATask)
        }, timeS * 1000)
    }

    public stop() {
        return
    }
}
