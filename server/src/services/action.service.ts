import { actionManager } from '../core/actionManager'
import { CreateActionDto, ModifyActionDto } from '../dtos/action.dto'
import HttpException from '../exceptions/HttpException'
import { IAction, ActionModel } from '../models/action.model'
import { IUser } from '../models/users.model'

class ActionService {
    public async create(user: IUser, data: CreateActionDto): Promise<IAction> {
        const tasksJson = []

        data.nodes.forEach((t) => tasksJson.push(JSON.stringify(t)))
        const action: IAction = new ActionModel({
            name: data.name,
            tasksJson: tasksJson,
            updated: new Date(data.updated),
            enable: false,
            rowData: data.rowData,
        })
        user.actions.push(action)
        user.save()
        return action
    }

    public async delete(user: IUser, actionId: any) {
        let target: IAction = undefined
        const actions = user.actions.filter((s) => {
            if (s._id != actionId) return true
            target = s
            return false
        })
        if (!target) return false

        actionManager.stopAction(user, target.name)
        user.actions = actions
        await user.save()
        return true
    }

    public async update(user: IUser, action: IAction, data: ModifyActionDto) {
        if (data.nodes) {
            const tasksJson = []
            data.nodes.forEach((t) => tasksJson.push(JSON.stringify(t)))
            action.tasksJson = tasksJson
        }
        if (data.name) action.name = data.name
        if (data.enable != undefined) action.enable = data.enable
        if (data.updated) action.updated = data.updated
        if (data.rowData) action.rowData = data.rowData
        await user.save()
    }

    public get(user: IUser, actionId: any) {
        const action = user.actions.find((a) => a._id == actionId)
        if (!action) throw new HttpException(404, 'Action not found')

        return ActionService.getInfo(
            user,
            user.actions.find((a) => a._id == actionId),
            true
        )
    }

    public list(user: IUser) {
        const data = []

        for (const modelAction of user.actions) data.push(ActionService.getInfo(user, modelAction))
        return data
    }

    private static getInfo(user: IUser, action: IAction, withShemas = false) {
        const aId = `${action._id}`
        const uId = `${user._id}`
        const runned = actionManager.actions.get(uId)?.get(aId)

        const info: any = {
            _id: action._id,
            name: action.name,
            currentVersion: action.updated,
            enable: action.enable,
        }
        if (withShemas) {
            info.schemas = action.tasksJson
            info.rowData = action.rowData
        }
        if (runned) {
            info.runStats = {
                status: runned.status,
                triggerType: runned.trigger.name,
                runnedVersion: runned.updated,
                lastTrigger: runned.trigger.lastExecuted,
            }
            if (runned.msg !== '') info.runStats.msgIfError = runned.msg
        }
        return info
    }
}

export default ActionService
