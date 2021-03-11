import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'

// ? IN
// number
// ? Out
// string
export default class StringTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.STRING, data, input)
    }

    public async _run(): Promise<properties> {
        const string = this.data.get('str')
        if (!string) throw '[String-Task] - Invalid arg'
        return new Map<string, any>([['string', string]])
    }
}
