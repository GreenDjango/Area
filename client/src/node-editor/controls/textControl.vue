<template>
    <input
        :type="type || 'text'"
        :readonly="readonly"
        :value="value"
        :placeholder="placeholder"
        @input="change($event)"
        @dblclick.stop=""
        @pointerdown.stop=""
        @pointermove.stop=""
    />
</template>

<script>
export default {
    props: ['readonly', 'placeholder', 'type', 'emitter', 'ikey', 'getData', 'putData'],
    data() {
        return {
            value: '',
        }
    },
    methods: {
        change(e) {
            this.value = String(e.target.value)
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

<style>
select,
input {
    width: 100%;
    border-radius: 30px;
    background-color: white;
    padding: 2px 6px;
    border: 1px solid #999;
    font-size: 110%;
    width: 170px;
}
</style>

