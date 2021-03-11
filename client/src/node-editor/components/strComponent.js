import Rete from 'rete'
import { TextControl } from '../controls/control.js'
import { StrSocket } from './socket.js'
import customNode from '../customNode.vue'

export class StrComponent extends Rete.Component {
    constructor() {
        super('String')
        this.category = 'String'
    }

    builder(node) {
        const out1 = new Rete.Output('string', 'String', StrSocket)
        return node.addControl(new TextControl(this.editor, 'str')).addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['string'] = node.data.str || ''
    }
}

export class AddStrComponent extends Rete.Component {
    constructor() {
        super('AddStr')
        this.data.component = customNode
        this.data.props = {}
        this.category = 'String'
        this.title = 'Add String'
    }

    builder(node) {
        node.title = this.title

        const inp1 = new Rete.Input('str1', 'String 1', StrSocket)
        const inp2 = new Rete.Input('str2', 'String 2', StrSocket)
        const out = new Rete.Output('res', 'String', StrSocket)

        inp1.addControl(new TextControl(this.editor, 'str1'))
        inp2.addControl(new TextControl(this.editor, 'str2'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new TextControl(this.editor, 'preview', true))
            .addOutput(out)
    }

    worker(node, inputs, outputs) {
        const s1 = inputs['str1'].length ? inputs['str1'][0] : node.data.str1
        const s2 = inputs['str2'].length ? inputs['str2'][0] : node.data.str2
        const sum = String(s1 || '') + String(s2 || '')

        this.editor.nodes
            .find(n => n.id == node.id)
            .controls.get('preview')
            .setValue(sum)
        outputs['res'] = sum
    }
}
