import { Action } from '../interfaces/action.class'
import { ATask, taskList } from '../interfaces/task.abstract'
import ATrigger from '../interfaces/trigger.interface'
import { IAction } from '../models/action.model'
import { IUser } from '../models/users.model'
import { NodeDto } from '../dtos/action.dto'
import TranslateTask from './tasks/translate.task'
import DiscordOnMsgTask from './trigger/discord-onMsg.trigger'
import DiscordSendMsgTask from './tasks/discord-sendMsg.task'
import MeteoTask from './tasks/meteo.task'
import DiscordFindChannelIdTask from './tasks/discord-findChannelId.task'
import onTimerTask from './trigger/timer.trigger'
import YoutubeUpdateVideoTask from './tasks/youtube-updateVideo.task'
import CalendarCommingEventTask from './tasks/calendar-commingEvent.task'
import NumberTask from './tasks/number.task'
import StringTask from './tasks/string.task'
import AddStringTask from './tasks/add-string.task'
import AddNumberTask from './tasks/add-number.task'
import DealabsOnHotDealTask from './trigger/dealabs-onHotDeal.trigger'
import EventTask from './trigger/event.trigger'
import CooldownTask from './trigger/cooldown.trigger'

export class ActionManager {
    actions: Map<string, Map<string, Action>> = new Map()

    stopAction(user: IUser, name: string) {
        const uId = `${user._id}`
        const userAction = this.actions.get(uId)
        if (!userAction) return

        for (const [key, action] of userAction) {
            if (key == name) {
                action.stop()
                userAction.delete(key)
            }
        }
    }

    syncUserAction(user: IUser) {
        // L'user a un dico ?
        const uId = `${user._id}`
        let userAction = this.actions.get(uId)
        if (!userAction) {
            this.actions.set(uId, new Map())
            userAction = this.actions.get(uId)
        }

        // Add or update Actions
        for (const action of user.actions) {
            if (action.enable == false) continue

            const aId = `${action._id}`
            const finded = userAction.get(aId)

            if (finded && finded.updated.getTime() === action.updated.getTime()) continue
            if (finded) finded.stop()

            const created = ActionManager.createAction(user, action)
            userAction.set(aId, created)
            created.start(user)
        }

        // Delete
        for (const [key, action] of userAction) {
            const target = user.actions.find((a) => a._id == key)
            if (!target || !target.enable) {
                action.stop()
                userAction.delete(key)
            }
        }
    }

    static createAction(user: IUser, model: IAction): Action {
        const tasks: ATask[] = []
        let trigger: ATrigger = undefined

        model.tasksJson.forEach((j) => {
            const t: NodeDto = JSON.parse(j)
            if (!t.isTrigger) tasks.push(ActionManager.nodeToTask(t, user))
            else trigger = ActionManager.nodeToTask(t, user) as ATrigger
        })
        if (!trigger || tasks === []) throw 'Invalid trigger or tasks'

        const action: Action = new Action({
            name: model.name,
            trigger: trigger,
            tasks: tasks,
            userId: user._id,
            updated: model.updated,
        })
        return action
    }

    static nodeToTask(node: NodeDto, user: IUser): ATask {
        switch (node.type) {
            case taskList.TRANSLATE:
                return new TranslateTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.DISCORD_ON_MSG:
                return new DiscordOnMsgTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.DISCORD_SEND_MSG:
                return new DiscordSendMsgTask(node.id, new Map<string, any>(node.data), node.input, user)
            case taskList.METEO:
                return new MeteoTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.DISCORD_FIND_CHANNEL_ID:
                return new DiscordFindChannelIdTask(node.id, new Map<string, any>(node.data), node.input, user)
            case taskList.TIMER:
                return new onTimerTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.YOUTUBE_EDIT_TITLE_DESC:
                return new YoutubeUpdateVideoTask(node.id, new Map<string, any>(node.data), node.input, user)
            case taskList.CALENDAR_COMMING_EVENT:
                return new CalendarCommingEventTask(node.id, new Map<string, any>(node.data), node.input, user)
            case taskList.NUMBER:
                return new NumberTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.STRING:
                return new StringTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.ADD_NUMBER:
                return new AddNumberTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.ADD_STRING:
                return new AddStringTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.DEALABS_ON_HOT_DEAL:
                return new DealabsOnHotDealTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.EVENT:
                return new EventTask(node.id, new Map<string, any>(node.data), node.input)
            case taskList.COOLDOWN:
                return new CooldownTask(node.id, new Map<string, any>(node.data), node.input)
        }
    }
}

const actionManager = new ActionManager()
export { actionManager }

/*
    syncUserAction(user: IUser) {
        // L'user a un dico ?
        const uId = `${user._id}`
        let userAction = this.actions.get(uId)
        if (!userAction) {
            this.actions.set(uId, new Map())
            userAction = this.actions.get(uId)
        }

        // Add or update Actions
        for (const action of user.actions) {
            const aId = `${action._id}`
            const finded = userAction.get(aId)

            if (finded && finded.updated.getTime() === action.updated.getTime()) continue
            if (finded) finded.stop()

            const created = ActionManager.createAction(user, action)
            userAction.set(aId, created)
            created.start(user)
        }

        // Delete
        for (const [key, action] of userAction) {
            if (!user.actions.find((a) => a._id === key)) {
                action.stop()
                userAction.delete(key)
            }
        }
    }
    */
