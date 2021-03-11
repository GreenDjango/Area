import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'

// ? IN
// number
// ? Out
// string
export default class AddNumberTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.ADD_NUMBER, data, input)
    }

    public async _run(dep: properties): Promise<properties> {
        const number1 = this.data.get('num1') || dep.get('num1')
        const number2 = this.data.get('num2') || dep.get('num2')
        if (!number1 || !number2) throw '[NumberADD-Task] - Invalid arg'
        return new Map<string, any>([['res', number1 + number2]])
    }
}
