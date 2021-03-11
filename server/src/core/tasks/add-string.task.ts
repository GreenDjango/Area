import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'

// ? IN
// number
// ? Out
// string
export default class AddStringTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.ADD_STRING, data, input)
    }

    public async _run(dep: properties): Promise<properties> {
        const str1 = this.data.get('str1') || dep.get('str1')
        const str2 = this.data.get('str2') || dep.get('str2')
        if (!str1 || !str2) throw '[NumberADD-Task] - Invalid arg'
        return new Map<string, any>([['res', str1 + str2]])
    }
}
