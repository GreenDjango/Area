import { IUser } from '../../models/users.model'
import ATrigger from '../../interfaces/trigger.interface'
import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'
import { Client } from 'discord.js'

// ? IN
// prefix
// author
// ? Out
// msg
// author
// channel
export default class DiscordOnMsgTask extends ATrigger {
    res = new Map<string, any>()
    client = new Client()

    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.DISCORD_ON_MSG, data, input)
    }

    public async _run(): Promise<properties> {
        return this.res
    }

    public init(callback: (trigger: ATask) => Promise<void>, user: IUser) {
        // prerequis:
        const botToken = user.services.find((s) => s.name === 'discord-bot')?.access_token
        const prefix = this.data.get('prefix')
        const userTarget = this.data.get('authorIn')

        if (!botToken || !prefix) throw '[DiscordOnMsg-Trigger] - Invalid Data'

        this.client.on('message', async (msg) => {
            if (msg.author.bot || !msg.content.startsWith(prefix)) return
            if (userTarget && `${msg.author.username}#${msg.author.discriminator}` !== userTarget) return
            const task = new DiscordOnMsgTask(this.id, this.data, this.input)

            task.res.set('msg', msg.content.slice(prefix.length))
            task.res.set('author', msg.author.id)
            task.res.set('channel', msg.channel.id)
            this.lastExecuted = new Date()
            callback(task as ATask)
        })
        this.client.login(botToken)
    }

    public stop() {
        this.client.destroy()
    }
}
