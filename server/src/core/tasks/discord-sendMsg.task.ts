import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'
import { Client, GuildChannel, TextChannel } from 'discord.js'
import { IUser } from '../../models/users.model'

// ? IN
// msg
// channel
export default class DiscordSendMsgTask extends ATask {
    client = new Client()

    constructor(id: number, data: properties, input: socketIN[], user: IUser) {
        super(id, taskList.DISCORD_SEND_MSG, data, input)

        const botToken = user.services.find((s) => s.name === 'discord-bot')?.access_token
        if (!botToken) throw '[DiscordSendMsg-Task] - Invalid Data'

        this.client.login(botToken)
    }

    public async _run(dep: properties): Promise<properties> {
        const msg = dep.get('msg') || this.data.get('msg')
        const channelID = dep.get('channel') || this.data.get('channel')
        if (!msg || !channelID) throw 'Invalid Data'
        let channel: GuildChannel = undefined

        if (!this.client.readyAt) {
            let wait = true
            this.client.on('ready', async () => {
                wait = false
            })
            let i = 0
            for (; i < 60 && wait; i++) {
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
            console.log('DEBUG: Discord cold start:', i)
        }
        this.client.guilds.cache.forEach(async (g) => {
            if (g.channels.cache.size <= 0) await this.client.guilds.fetch(g.id)
            const target = g.channels.cache.find((c) => c.id == channelID)
            if (target && !channel) channel = target
            if (!channel) channel = g.channels.resolve(channelID)
        })

        if (!channel) throw 'Invalid Channel'
        const tc = channel as TextChannel
        await tc.send(msg)
        return new Map<string, any>()
    }
}
