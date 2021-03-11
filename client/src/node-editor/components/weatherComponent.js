import Rete from 'rete'
import { NumControl } from '../controls/control.js'
import { StrSocket, NumSocket } from './socket.js'
import customNode from '../customNode.vue'

export class WeatherComponent extends Rete.Component {
    constructor() {
        super('Weather')
        this.data.component = customNode
        this.data.props = { img: 'icon-weather.png' }
        this.category = 'Weather'
        this.title = 'Weather'
    }

    builder(node) {
        node.category = this.category
        node.title = this.title

        const inp1 = new Rete.Input('lat', 'Latitude', NumSocket)
        const inp2 = new Rete.Input('long', 'Longitude', NumSocket)
        inp1.addControl(new NumControl(this.editor, 'lat', false, 0, 90, 'Latitude'))
        inp2.addControl(new NumControl(this.editor, 'long', false, -180, 180, 'Longitude'))

        const out1 = new Rete.Output('weather', 'Weather', StrSocket)

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addOutput(out1)
    }

    worker(node, inputs, outputs) {
        outputs['weather'] = '$WEATHER'
    }
}
