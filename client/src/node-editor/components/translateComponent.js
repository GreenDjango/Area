import Rete from 'rete'
import { TextControl } from '../controls/control.js'
import { StrSocket, TriggerSocket } from './socket.js'
import customNode from '../customNode.vue'

export class TranslateComponent extends Rete.Component {
    constructor() {
        super('Transalte')
        this.data.component = customNode
        this.data.props = { img: 'icon-translate.png' }
        this.category = 'Translate'
        this.title = 'Translate'
    }

    builder(node) {
        node.category = this.category
        node.title = this.title

        const inp1 = new Rete.Input('text', 'Text', StrSocket)
        const inp2 = new Rete.Input('src', 'From', StrSocket)
        const inp3 = new Rete.Input('dest', 'To', StrSocket)
        inp1.addControl(new TextControl(this.editor, 'text', false, 'text'))
        inp2.addControl(new TextControl(this.editor, 'src', false, "from: ex 'fr'"))
        inp3.addControl(new TextControl(this.editor, 'dest', false, "to: ex 'en'"))

        const out1 = new Rete.Output('translation', 'Translation', StrSocket)

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
            .addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['translation'] = '$TRANSLATION'
    }
}
