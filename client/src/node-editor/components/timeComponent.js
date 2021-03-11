import Rete from 'rete'
import { NumControl, TextControl } from '../controls/control.js'
import { TriggerSocket } from './socket.js'
import customNode from '../customNode.vue'

class TimeComponent extends Rete.Component {
    constructor(name) {
        super(name)
        this.data.component = customNode
        this.data.props = { img: 'icon-time.svg' }
        this.category = 'Times'
    }

    builder(node) {
        node.category = this.category
        return node
    }
}

export class TimeOnTimerComponent extends TimeComponent {
    constructor() {
        super('TimeOnTimer')
        this.title = 'On timer'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('trigger', 'Trigger', TriggerSocket)
        return node.addControl(new NumControl(this.editor, 'num', false, 10, 999999, 'each X sec')).addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['trigger'] = node.data.num
    }
}

export class TimeOnEndCooldownComponent extends TimeComponent {
    constructor() {
        super('TimeOnEndCooldown')
        this.title = 'On end cooldown'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('trigger', 'Trigger', TriggerSocket)
        return node.addControl(new NumControl(this.editor, 'num', false, 10, 999999, 'wait X sec')).addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['trigger'] = node.data.num
    }
}

export class TimeOnEventComponent extends TimeComponent {
    constructor() {
        super('TimeOnEvent')
        this.title = 'On event'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('trigger', 'Trigger', TriggerSocket)
        return node
            .addControl(new TextControl(this.editor, 'date', false, '', 'date'))
            .addControl(new TextControl(this.editor, 'time', false, '', 'time'))
            .addOutput(out1)
    }

    worker(node, inputs, outputs) {
        if (!node.data.date) {
            node.data.num = Math.floor(Date.now() / 1000)
            return
        }
        const [year, month, day] = node.data.date.split('-')
        let hour = 0
        let minute = 0
        if (node.data.time) {
            ;[hour, minute] = node.data.time.split(':')
        }
        const date = new Date(year, month - 1, day, hour, minute)
        node.data.num = Math.floor(date.getTime() / 1000)
    }
}
