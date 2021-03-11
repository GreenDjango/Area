<template>
    <div class="node" :class="[selected(), node.name] | kebab">
        <img class="icon" v-if="img" :src="require(`@/assets/${img}`)" />
        <div class="category" v-if="node.category">{{ node.category }}</div>
        <div class="title">{{ node.title || node.name }}</div>
        <div v-for="output in outputs()" :key="output.key" class="output">
            <div class="output-title">{{ output.name }}</div>
            <Socket v-socket:output="output" type="output" :socket="output.socket" />
        </div>
        <div v-for="control in controls()" :key="control.key" v-control="control" class="control"></div>

        <div v-for="input in inputs()" :key="input.key" class="input">
            <Socket v-socket:input="input" type="input" :socket="input.socket" />
            <div v-show="!input.showControl()" class="input-title">{{ input.name }}</div>
            <div v-show="input.showControl()" v-control="input.control" class="input-control"></div>
        </div>
    </div>
</template>

<script>
import ReteRender from 'rete-vue-render-plugin'
export default {
    mixins: [ReteRender.mixin],
    props: ['img'],
    components: { Socket: ReteRender.Socket },
}
</script>

<style lang="stylus" scoped>
.node {
  background-color: rgba(110, 136, 255, 0.8);
  border: 2px solid #4e58bf;
  border-radius: 10px;
  cursor: pointer;
  min-width: 180px;
  height: auto;
  padding-bottom: 6px;
  box-sizing: content-box;
  position: relative;
  user-select: none;

  &:hover {
    background-color: rgba(130, 153, 255, 0.8);
  }

  &.selected {
    background-color: #ffd92c;
    border-color: #e3c000;
  }

  .icon {
    position: absolute;
    top: 5px;
    right: 5px;
    max-height: 64px;
    max-width: 64px;
    opacity: 0.9;
    pointer-events: none;
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  .category {
    color: black;
    font-family: sans-serif;
    font-size: 16px;
    padding: 8px 8px 0 8px;
    margin-right: 64px;
  }

  .title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 8px;
    margin-right: 64px;
  }

  .category + .title {
    padding: 0 8px 8px 8px;
  }

  .output {
    text-align: right;
  }

  .input {
    text-align: left;
  }

  .input-title, .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: 6px;
    line-height: 24px;
  }

  .input-control {
    z-index: 1;
    width: calc(100% - 36px);
    vertical-align: middle;
    display: inline-block;
  }

  .control {
    padding: 6px 18px;
  }
}
</style>
