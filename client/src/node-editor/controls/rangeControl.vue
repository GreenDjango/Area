<template>
    <div class="range-control">
        <input
            type="number"
            :value="value"
            :min="min"
            :max="max"
            :placeholder="placeholder"
            :step="step || 1"
            @input="change($event)"
            @dblclick.stop=""
            @pointerdown.stop=""
            @pointermove.stop=""
        />
        <input
            type="range"
            :readonly="readonly"
            :value="value"
            :min="min"
            :max="max"
            :step="step || 1"
            @input="change($event)"
            @dblclick.stop=""
            @pointerdown.stop=""
            @pointermove.stop=""
        />
    </div>
</template>

<script>
export default {
    props: ['readonly', 'min', 'max', 'placeholder', 'step', 'emitter', 'ikey', 'getData', 'putData'],
    data() {
        return {
            value: 0,
        }
    },
    methods: {
        change(e) {
            this.value = Number(e.target.value)
            this.update()
        },
        update() {
            if (this.ikey) this.putData(this.ikey, this.value)
            this.emitter.trigger('process')
        },
    },
    mounted() {
        this.value = this.getData(this.ikey)
    },
}
</script>

<style scoped>
.range-control {
    display: flex;
    flex-direction: column;
}
</style>
