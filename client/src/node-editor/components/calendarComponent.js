import Rete from 'rete'
import { StrSocket } from './socket.js'
import customNode from '../customNode.vue'

class CalendarComponent extends Rete.Component {
    constructor(name) {
        super(name)
        this.data.component = customNode
        this.data.props = { img: 'icon-calendar.png' }
        this.category = 'Calendar'
    }

    builder(node) {
        node.category = this.category
        return node
    }
}

export class CalendarCommingEventComponent extends CalendarComponent {
    constructor() {
        super('CalendarCommingEvent')
        this.title = 'Calendar comming event'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('event', 'Event', StrSocket)

        return node.addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['event'] = '$EVENT'
    }
}
