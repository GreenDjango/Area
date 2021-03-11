import ATrigger from './trigger.interface'
import { ATask } from './task.abstract'
import { IUser } from '../models/users.model'

enum ActionState {
    NONE = 1,
    STARTED,
    STOPED,
    CRASHED,
}

class Action {
    name: string
    trigger: ATrigger
    tasks: ATask[]
    userId: string
    updated: Date
    status = ActionState.NONE
    msg = ''

    public constructor(init?: Partial<Action>) {
        Object.assign(this, init)
    }

    start(user: IUser) {
        this.status = ActionState.STARTED
        try {
            this.trigger.init(async (trigger: ATask) => {
                try {
                    const tmpTasks: ATask[] = [trigger]
                    tmpTasks.push(...this.tasks)
                    for (const t of tmpTasks) {
                        await t.runWithProperties((id) => tmpTasks.find((t) => t.id == id))
                    }
                } catch (err) {
                    this.msg = `${err}`
                    this.stop(ActionState.CRASHED)
                }
            }, user)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    stop(state?: ActionState) {
        this.status = state || ActionState.STOPED
        this.trigger.stop()
    }
}

export { Action }
