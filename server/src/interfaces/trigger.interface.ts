import { IUser } from '../models/users.model'
import { ATask } from './task.abstract'

export default abstract class ATrigger extends ATask {
    lastExecuted: Date | undefined

    abstract init(callback: (trigger: ATask) => Promise<void>, user: IUser): void

    abstract stop(): void
}
