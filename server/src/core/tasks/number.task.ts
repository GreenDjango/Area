import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'

// ? IN
// number
// ? Out
// string
export default class NumberTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.NUMBER, data, input)
    }

    public async _run(): Promise<properties> {
        const number = this.data.get('num')
        if (!number) throw '[Number-Task] - Invalid arg'
        return new Map<string, any>([['num', number]])
    }
}
