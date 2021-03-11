import Rete from 'rete'
import { TextControl, RangeControl } from '../controls/control.js'
import { NumSocket, StrSocket, TriggerSocket } from './socket.js'
import customNode from '../customNode.vue'

class DealabsComponent extends Rete.Component {
    constructor(name) {
        super(name)
        this.data.component = customNode
        this.data.props = { img: 'icon-dealabs.svg' }
        this.category = 'Dealabs'
    }

    builder(node) {
        node.category = this.category
        return node
    }
}

export class DealabsOnHotDealComponent extends DealabsComponent {
    constructor() {
        super('DealabsOnHotDeal')
        this.title = 'On hot deal'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const out1 = new Rete.Output('title', 'Title', StrSocket)
        const out2 = new Rete.Output('vote', 'Vote', NumSocket)
        const out3 = new Rete.Output('category', 'Category', StrSocket)
        const out4 = new Rete.Output('uploadDate', 'Upload date', StrSocket)
        const out5 = new Rete.Output('price', 'Price', NumSocket)
        const out6 = new Rete.Output('trigger', 'Trigger', TriggerSocket)

        return node
            .addControl(new TextControl(this.editor, 'pattern', false, 'pattern'))
            .addControl(new RangeControl(this.editor, 'voteMin', false, 0, 500, 'vote minimum', 10))
            .addOutput(out1)
            .addOutput(out2)
            .addOutput(out3)
            .addOutput(out4)
            .addOutput(out5)
            .addOutput(out6)
    }

    worker(node, inputs, outputs) {
        outputs['title'] = '$TITLE'
        outputs['vote'] = '$VOTE'
        outputs['category'] = '$CATEGORY'
        outputs['uploadDate'] = '$UPLOAD_DATE'
        outputs['price'] = 0
    }
}
