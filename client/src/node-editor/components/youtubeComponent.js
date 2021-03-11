import Rete from 'rete'
import { TextControl } from '../controls/control.js'
import { StrSocket, TriggerSocket } from './socket.js'
import customNode from '../customNode.vue'

class YoutubeComponent extends Rete.Component {
    constructor(name) {
        super(name)
        this.data.component = customNode
        this.data.props = { img: 'icon-youtube.svg' }
        this.category = 'Youtube'
    }

    builder(node) {
        node.category = this.category
        return node
    }
}

export class YoutubeEditVideoComponent extends YoutubeComponent {
    constructor() {
        super('YoutubeEditVideo')
        this.title = 'Edit video'
    }

    builder(node) {
        node = super.builder(node)
        node.title = this.title

        const inp1 = new Rete.Input('url', 'Url', StrSocket)
        const inp2 = new Rete.Input('title', 'Title', StrSocket)
        const inp3 = new Rete.Input('desc', 'Description', StrSocket)
        const inp4 = new Rete.Input('trigger', 'Trigger', TriggerSocket)
        inp1.addControl(new TextControl(this.editor, 'url', false, 'video url', 'url'))
        inp2.addControl(new TextControl(this.editor, 'title', false, 'title'))
        inp3.addControl(new TextControl(this.editor, 'desc', false, 'description'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
            .addInput(inp4)
    }

    worker(node, inputs, outputs) {}
}
