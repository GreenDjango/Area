<template>
    <div
        class="context-menu card max-w-sm shadow-2xl bg-default overflow-visible"
        ref="menu"
        v-if="visible"
        v-bind:style="style"
        @contextmenu.prevent=""
        @wheel.stop=""
    >
        <div class="card-body p-5">
            <div class="flex space-x-2 mb-2 w-full">
                <button @click="hide(true)" class="btn btn-primary btn-square btn-sm">
                    <Icon glyph="close" class="inline-block w-6 h-6 stroke-current" />
                </button>
                <input
                    v-if="searchBar"
                    class="input input-primary input-bordered input-sm w-full"
                    v-model="filter"
                    placeholder="Search..."
                />
            </div>
            <div
                v-for="item in filtered"
                :key="item.title"
                class="w-full menu-item"
                @click="onClick(item, $event)"
                @mouseover="showSubitems(item)"
                @mouseleave="hideSubitems(item)"
                :class="{ hasSubitems: hasSubitem(item) }"
            >
                {{ item.title }}
                <div v-show="hasSubitem(item) && subShow == item.title" class="menu-subitems card max-w-sm shadow-2xl bg-default">
                    <div class="card-body p-2">
                        <div
                            v-for="itemSub in item.subitems"
                            :key="itemSub.title"
                            class="w-full menu-item"
                            @click="onClick(itemSub, $event)"
                        >
                            {{ itemSub.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: { searchBar: Boolean, searchKeep: Function },
    data() {
        return {
            x: 0,
            y: 0,
            visible: false,
            args: {},
            filter: '',
            items: [],
            subShow: undefined,
        }
    },
    computed: {
        style() {
            return {
                top: this.y + 'px',
                left: this.x + 'px',
            }
        },
        filtered() {
            if (!this.filter) return this.items
            const regex = new RegExp(this.filter, 'i')

            return this.extractLeafs(this.items).filter(({ title }) => {
                return this.searchKeep(title) || title.match(regex)
            })
        },
    },
    mounted() {
        this.$root.$on('show', this.show)
        this.$root.$on('hide', this.hide)
        this.$root.$on('additem', this.additem)
    },
    methods: {
        showSubitems(item) {
            this.subShow = item.title
        },
        hideSubitems(item) {
            if (this.subShow == item.title) this.subShow = undefined
        },
        onClick(item, e) {
            e.stopPropagation()

            if (item.onClick) {
                item.onClick(this.args)
                this.hide(true)
            }
        },
        hasSubitem(item) {
            if (item.subitems && item.subitems.length) return true
            return false
        },
        extractLeafs(items) {
            if (!items) return []
            let leafs = []
            items.map((item) => {
                if (!item.subitems) leafs.push(item)
                leafs.push(...this.extractLeafs(item.subitems))
            })
            return leafs
        },
        onSearch(e) {
            this.filter = e
        },
        show(x, y, args = {}) {
            this.visible = true
            this.x = x
            this.y = y
            this.args = args
        },
        hide(fromMenu) {
            //if (fromMenu)
            this.visible = false
        },
        additem(title, onClick, path = []) {
            let items = this.items
            for (let level of path) {
                let exist = items.find((i) => i.title === level)
                if (!exist) {
                    exist = { title: level, subitems: [] }
                    items.push(exist)
                }
                items = exist.subitems || (exist.subitems = [])
            }
            items.push({ title, onClick })
        },
    },
}
</script>

<style scoped>
.context-menu {
    left: 0;
    top: 0;
    position: fixed;
    width: 200px;
}

.menu-item {
    cursor: default;
    position: relative;
    border-bottom-color: hsl(0deg 0% 40%/40%);
    border-bottom-width: 1px;
    padding: 0.25rem 0;
}

.menu-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.menu-item:not(.hasSubitems) {
    cursor: pointer;
}

.menu-item.hasSubitems:after {
    content: '►';
    position: absolute;
    opacity: 0.6;
    right: 5px;
    top: 5px;
}

div > .menu-item:last-child {
    border: none;
    padding-bottom: 0;
}

.menu-subitems div > .menu-item:first-child {
    padding-top: 0;
}

.menu-subitems {
    position: absolute;
    top: -0.25rem;
    left: 100%;
    width: 120px;
}

.w-min {
    width: min-content;
}
</style>
