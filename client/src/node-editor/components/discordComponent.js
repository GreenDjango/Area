import Rete from 'rete'
import { TextControl } from '../controls/control.js'
import { StrSocket, TriggerSocket } from './socket.js'
import customNode from '../customNode.vue'

class DiscordComponent extends Rete.Component {
    constructor(name) {
        super(name)
        this.data.component = customNode
        this.data.props = { img: 'icon-discord.svg' }
        this.category = 'Discord'
    }

    builder(node) {
        node.category = this.category
        return node
    }
}

export class DiscordOnMsgComponent extends DiscordComponent {
    constructor() {
        super('DiscordOnMsg')
        this.title = 'On message'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('msg', 'Message', StrSocket)
        const out2 = new Rete.Output('authorOut', 'Author', StrSocket)
        const out3 = new Rete.Output('channel', 'Channel ID', StrSocket)
        const out4 = new Rete.Output('trigger', 'Trigger', TriggerSocket)

        return node
            .addControl(new TextControl(this.editor, 'prefix', false, 'prefix'))
            .addControl(new TextControl(this.editor, 'authorIn', false, 'author'))
            .addOutput(out1)
            .addOutput(out2)
            .addOutput(out3)
            .addOutput(out4)
    }

    worker(node, inputs, outputs) {
        const author = node.data.authorIn

        outputs['msg'] = '$MSG'
        outputs['authorOut'] = author || '$AUTHOR'
        outputs['channel'] = '$CHANNEL'
    }
}

export class DiscordSendMsgComponent extends DiscordComponent {
    constructor() {
        super('DiscordSendMsg')
        this.title = 'Send message'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const inp1 = new Rete.Input('msg', 'Message', StrSocket)
        const inp2 = new Rete.Input('channel', 'Channel ID', StrSocket)
        const inp3 = new Rete.Input('trigger', 'Trigger', TriggerSocket)
        inp1.addControl(new TextControl(this.editor, 'msg', false, 'message'))
        inp2.addControl(new TextControl(this.editor, 'channel', false, 'channel id'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
    }

    worker(node, inputs, outputs) {}
}

export class DiscordFindChannelIdComponent extends DiscordComponent {
    constructor() {
        super('DiscordFindChannelId')
        this.title = 'Find channel ID'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const inp1 = new Rete.Input('channelName', 'Channel name', StrSocket)
        inp1.addControl(new TextControl(this.editor, 'channelName', false, 'channel name'))

        const out1 = new Rete.Output('channelID', 'Channel ID', StrSocket)

        return node.addInput(inp1).addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['channelID'] = '$CHANNELID'
    }
}
