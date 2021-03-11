<template>
    <div :class="{ 'alert-box-down': isDown }" class="alert-box absolute z-20 flex flex-col p-2 cursor-pointer">
        <div class="alert">
            <div class="flex-1">
                <Icon v-if="!type || type == 'alert'" glyph="bell" class="flex-shrink-0 w-6 h-6 mx-2" color="#009688" />
                <Icon v-if="type == 'info'" glyph="info" class="flex-shrink-0 w-6 h-6 mx-2" color="#2094F3" />
                <Icon v-if="type == 'success'" glyph="folder" class="flex-shrink-0 w-6 h-6 mx-2" color="#009485" />
                <Icon v-if="type == 'warning'" glyph="warning" class="flex-shrink-0 w-6 h-6 mx-2" color="#FF9900" />
                <Icon v-if="type == 'error'" glyph="invalid" class="flex-shrink-0 w-6 h-6 mx-2" color="#ff5722" />
                <label
                    ><h4>{{ title }}</h4>
                    <p class="text-sm text-content-400">
                        {{ text }}
                    </p></label
                >
            </div>
            <div class="flex-none">
                <button @click="onItemClick" class="btn btn-sm btn-ghost btn-square">
                    <Icon glyph="close" class="w-6 h-6 stroke-current" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { events } from './events'

export default {
    name: 'Alert',
    props: {},
    data() {
        return {
            title: '',
            text: '',
            type: '',
            list: [],
            isDown: false,
            duration: 3000,
        }
    },
    mounted() {
        events.$on('add', this.addItem)
        events.$on('close', this.closeItem)
    },
    methods: {
        showAlert() {
            if (!this.list[0] || this.isDown) return
            const item = this.list[0]

            this.title = item.title || ''
            this.text = item.text || ''
            this.type = item.type || ''
            this.isDown = true
            if (item.duration >= 0) {
                item.timer = setTimeout(() => {
                    this.onDestroy(item)
                }, item.duration)
            }
        },
        addItem(event) {
            if (event.clean || event.clear) {
                this.isDown = false
                this.list = []
                return
            }

            const duration = typeof event.duration === 'number' ? event.duration : this.duration
            const { title, text, type } = event
            const item = { title, text, type, duration }

            this.list.push(item)
            this.showAlert()
        },
        closeItem(id) {
            console.log('close', id)
        },
        onDestroy(item) {
            if (item.timer) clearTimeout(item.timer)
            this.list.shift()
            this.isDown = false
            this.showAlert()
        },
        onItemClick() {
            if (!this.list[0]) return
            this.onDestroy(this.list[0])
        },
    },
}
</script>

<style scoped>
.alert-box {
    position: fixed;
    top: 0;
    right: 0;
    transform: translate(0, -101%);
    transition: transform 700ms cubic-bezier(0.32, 0, 0.07, 1);
}

.alert-box-down {
    transform: translate(0, 0);
}
</style>
