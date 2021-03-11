import Rete from 'rete'
import VueNumControl from './numControl.vue'
import VueTextControl from './textControl'
import VueRangeControl from './rangeControl'

export class NumControl extends Rete.Control {
    constructor(emitter, key, readonly, min, max, placeholder) {
        super(key)
        this.component = VueNumControl
        this.props = { emitter, ikey: key, readonly, min, max, placeholder }
    }

    setValue(val) {
        this.vueContext.value = val
    }
}

export class TextControl extends Rete.Control {
    constructor(emitter, key, readonly, placeholder, type) {
        super(key)
        this.component = VueTextControl
        this.props = { emitter, ikey: key, readonly, placeholder, type }
    }

    setValue(val) {
        this.vueContext.value = val
    }
}

export class RangeControl extends Rete.Control {
    constructor(emitter, key, readonly, min, max, placeholder, step) {
        super(key)
        this.component = VueRangeControl
        this.props = { emitter, ikey: key, readonly, min, max, placeholder, step }
    }

    setValue(val) {
        this.vueContext.value = val
    }
}
