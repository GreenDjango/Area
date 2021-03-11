import Rete from 'rete'
import { NumControl } from '../controls/control.js'
import { NumSocket } from './socket.js'
import customNode from '../customNode.vue'

export class NumComponent extends Rete.Component {
    constructor() {
        super('Number')
        this.category = 'Number'
    }

    builder(node) {
        const out1 = new Rete.Output('num', 'Number', NumSocket)
        return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['num'] = node.data.num
    }
}

export class AddNumComponent extends Rete.Component {
    constructor() {
        super('AddNum')
        this.data.component = customNode
        this.data.props = {}
        this.category = 'Number'
        this.title = 'Add Number'
    }

    builder(node) {
        node.title = this.title

        const inp1 = new Rete.Input('num1', 'Number 1', NumSocket)
        const inp2 = new Rete.Input('num2', 'Number 2', NumSocket)
        const out = new Rete.Output('res', 'Number', NumSocket)

        inp1.addControl(new NumControl(this.editor, 'num1', false, undefined, undefined, 'number 1'))
        inp2.addControl(new NumControl(this.editor, 'num2', false, undefined, undefined, 'number 2'))

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new NumControl(this.editor, 'preview', true))
            .addOutput(out)
    }

    worker(node, inputs, outputs) {
        const n1 = inputs['num1'].length ? inputs['num1'][0] : node.data.num1
        const n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2
        const sum = Number(n1 || 0) + Number(n2 || 0)

        this.editor.nodes
            .find(n => n.id == node.id)
            .controls.get('preview')
            .setValue(sum)
        outputs['res'] = sum
    }
}
