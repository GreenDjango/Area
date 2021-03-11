import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'
import { Client, GuildChannel } from 'discord.js'
import { IUser } from '../../models/users.model'

// ? IN
// channelName
// ? Out
// channelID
export default class DiscordFindChannelIdTask extends ATask {
    client = new Client()

    constructor(id: number, data: properties, input: socketIN[], user: IUser) {
        super(id, taskList.DISCORD_FIND_CHANNEL_ID, data, input)

        const botToken = user.services.find((s) => s.name === 'discord-bot')?.access_token
        if (!botToken) throw '[DiscordSendMsg-Task] - Invalid Data'

        this.client.login(botToken)
    }

    public async _run(dep: properties): Promise<properties> {
        const channelName = dep.get('channelName') || this.data.get('channelName')
        if (!channelName) throw 'Invalid Data'
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
        this.client.guilds.cache.forEach((g) => {
            channel = g.channels.cache.find((c) => c.name === channelName)
        })

        if (!channel) throw 'Invalid Channel'
        return new Map<string, any>([['channelID', channel.id]])
    }
}
