<template>
    <input
        type="number"
        :readonly="readonly"
        :value="value"
        :min="min"
        :max="max"
        :placeholder="placeholder"
        @input="change($event)"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop=""
    />
</template>

<script>
export default {
    props: ['readonly', 'min', 'max', 'placeholder', 'emitter', 'ikey', 'getData', 'putData'],
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
</style>
