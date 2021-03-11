<template>
    <div id="rete" ref="rete">
        <svg width="0" height="0">
            <defs>
                <linearGradient id="cl1">
                    <stop stop-color="#96b38a" />
                    <stop offset="100%" stop-color="#6464f0" />
                </linearGradient>
            </defs>
        </svg>
        <div class="absolute top-0 left-0 flex flex-row p-2 z-10">
            <button class="btn m-1">Task: {{ name }}</button>
        </div>
        <div class="absolute bottom-0 right-0 flex flex-col p-2 z-10">
            <button @click="newNode()" class="btn btn-sm m-1">New node</button>
            <button @click="editServices" class="btn btn-sm m-1">Edit services</button>
            <button @click="save()" class="btn btn-primary btn-sm m-1">Save</button>
        </div>
    </div>
</template>

<script>
import Rete, { NodeEditor, Engine } from 'rete'
import VueRenderPlugin from 'rete-vue-render-plugin'
import ConnectionPlugin from 'rete-connection-plugin'
import AreaPlugin from 'rete-area-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import Components from '@/node-editor/components/component'
import customMenu from '@/node-editor/customMenu.vue'

export default {
    name: 'Rete',
    props: { name: String, data: Object, hideCategories: Array },
    data() {
        return {
            /** @type {NodeEditor} */
            editor: undefined,
            /** @type {Engine} */
            engine: undefined,
            components: [],
            defaultData: {
                id: 'area@0.1.0',
                nodes: {
                    4: {
                        id: 4,
                        data: { num: 33 },
                        inputs: {},
                        outputs: {
                            num: {
                                connections: [
                                    {
                                        node: 6,
                                        input: 'num1',
                                        data: {},
                                    },
                                ],
                            },
                        },
                        position: [80, 200],
                        name: 'Number',
                    },
                    5: {
                        id: 5,
                        data: { num: 22 },
                        inputs: {},
                        outputs: {
                            num: {
                                connections: [
                                    {
                                        node: 6,
                                        input: 'num2',
                                        data: {},
                                    },
                                ],
                            },
                        },
                        position: [80, 400],
                        name: 'Number',
                    },
                    6: {
                        id: 6,
                        data: {},
                        inputs: {
                            num1: {
                                connections: [
                                    {
                                        node: 4,
                                        output: 'num',
                                        data: {},
                                    },
                                ],
                            },
                            num2: {
                                connections: [
                                    {
                                        node: 5,
                                        output: 'num',
                                        data: {},
                                    },
                                ],
                            },
                        },
                        outputs: {
                            res: {
                                connections: [],
                            },
                        },
                        position: [500, 240],
                        name: 'AddNum',
                    },
                },
            },
            beforeunloadSave: null,
        }
    },
    mounted() {
        this.beforeunloadSave = window.onbeforeunload
        window.onbeforeunload = (e) => {
            const message = 'Quit editing?'
            const ev = e || window.event
            // For IE and Firefox
            if (ev) ev.returnValue = message
            // For Safari
            return message
        }
        this.initRete(this.$refs.rete)
    },
    beforeDestroy() {
        window.onbeforeunload = this.beforeunloadSave
    },
    methods: {
        async initRete(container) {
            const hideCategories = this.hideCategories
            for (const idx in Components) {
                this.components.push(new Components[idx]())
            }

            this.editor = new Rete.NodeEditor('area@0.1.0', container)
            this.editor.use(ConnectionPlugin)
            this.editor.use(VueRenderPlugin)
            this.editor.use(ContextMenuPlugin, {
                vueComponent: customMenu,
                delay: 20000,
                allocate(component) {
                    if (component.category) {
                        if (hideCategories.some((val) => val.toLowerCase() == component.category.toLowerCase())) return
                        return [component.category]
                    }
                    return []
                },
                rename(component) {
                    return component.title || component.name
                },
            })
            this.editor.use(AreaPlugin)

            this.engine = new Rete.Engine('area@0.1.0')
            for (const comp of this.components) {
                this.editor.register(comp)
                this.engine.register(comp)
            }

            this.editor.on('warn', (arg) => this.onReteError('warn', arg))
            this.editor.on('error', (arg) => this.onReteError('error', arg))

            await this.editor.fromJSON(this.data || this.defaultData)

            this.editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
                await this.engine.abort()
                await this.engine.process(this.editor.toJSON())
            })

            AreaPlugin.zoomAt(this.editor)
            setTimeout(() => this.editor.trigger('process'), 100)
        },
        onReteError(type, arg) {
            const msg = arg.message || String(arg)
            if (type === 'warn') {
                this.$notify({ title: 'Node warning', text: msg, type: 'warning' })
            } else {
                this.$notify({ title: 'Node error', text: msg, type: 'error' })
            }
        },
        newNode() {
            AreaPlugin.zoomAt(this.editor)
            this.editor.trigger('contextmenu', {
                e: {
                    clientX: window.innerWidth / 2 - 100,
                    clientY: 110,
                    preventDefault: () => {},
                    stopPropagation: () => {},
                },
            })
        },
        editServices() {
            if (confirm('Quit editing?')) this.$router.push({ name: 'Account' })
        },
        save() {
            const saveData = this.editor.toJSON()
            let hasTrigger = 0
            const hasHiddenService = []
            for (const idx in saveData.nodes) {
                const node = saveData.nodes[idx]
                const compo = this.components.find((val) => val.name == node.name)
                if (node.outputs['trigger']) hasTrigger++
                if (compo && this.hideCategories.some((val) => val.toLowerCase() == compo.category.toLowerCase()))
                    hasHiddenService.push(compo.category)
            }
            let error = undefined
            if (hasTrigger !== 1) error = 'Need exactly one trigger'
            if (hasHiddenService.length) error = 'Please enable service(s) for use node: ' + hasHiddenService.join(', ')
            if (error) {
                this.$notify({ title: 'Save error', text: error, type: 'error' })
                return
            }
            this.$emit('save', saveData)
            console.log(saveData)
        },
    },
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Ubuntu:400');

#rete {
  width: 100%;
  height: 100%;
  position: relative;

  .node > .input {
    background: none;
    border: none;
    height: auto;
    margin-top: 5px;
  }

  .node {
    input {
      color: #111;
    }

    select, input {
      width: 170px;
      border-radius: 30px;
      background-color: white;
      padding: 2px 6px;
      font-size: 110%;
      font-family: Ubuntu;
    }

    .input.trigger, .output.trigger {
      background: rgb(250, 80, 80);
    }

    .input.string, .output.string {
      background: rgb(100, 100, 240);
    }
  }

  .connection.socket-input-number.socket-output-number .main-path {
    stroke: #96b38a;
  }

  .connection.socket-input-string.socket-output-string .main-path {
    stroke: rgb(100, 100, 240);
  }

  .connection.socket-input-trigger.socket-output-trigger .main-path {
    stroke: rgb(250, 80, 80);
  }

  .connection.socket-input-string.socket-output-number .main-path {
    stroke: url('#cl1');
  }
}
</style>
