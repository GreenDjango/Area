<template>
    <Loading v-if="isLoading" />
    <div v-else-if="isError" class="hero min-h-full">
        <div class="flex-col hero-content lg:flex-row-reverse">
            <img :src="require(`@/assets/node-example.png`)" class="p-4 bg-content-100 max-w-sm rounded-lg shadow-2xl" />
            <div class="flex flex-col items-center">
                <h1 class="mb-5 text-5xl font-bold">Node Editor</h1>
                <p class="mb-5 text-center">
                    Editor can do visual programming. Editor allows you to create node-based editor directly in the browser. You
                    can define nodes and workers that allow users to create instructions for processing data in your editor
                    without a single line of code.
                </p>
                <form class="flex flex-col items-center" @submit.prevent="startEditor">
                    <input
                        type="text"
                        placeholder="Node name"
                        required
                        ref="name"
                        class="mb-3 input input-primary input-bordered focus:border-blue-600"
                    />
                    <input class="btn btn-primary w-min" type="submit" value="Get Started" />
                </form>
            </div>
        </div>
    </div>
    <Rete v-else v-on:save="onSave" :name="name" :data="reteData" :hideCategories="hideCategories" />
</template>

<script>
import { ApiServer, apiServer } from '../api/server.api.js'
import Converter from '../api/converter.api'

export default {
    name: 'Editor',
    components: {},
    props: { id: String },
    watch: { id: 'onIdUpdate' },
    data() {
        return {
            name: '',
            services: {},
            reteData: undefined,
            isLoading: true,
            isError: true,
            onEditing: false,
        }
    },
    created() {
        this.getServices().finally(() => this.getTask(this.id))
    },
    computed: {
        hideCategories() {
            const categories = []
            for (const key in this.services) {
                if (!this.services[key].active.value) categories.push(key.toLowerCase())
            }
            return categories
        },
    },
    methods: {
        onIdUpdate() {
            if (!this.onEditing || confirm('Quit editing?')) {
                this.getTask(this.id)
            }
        },
        async getTask(id) {
            this.isLoading = true
            this.isError = true

            if (!id) {
                // this.isError = true
            } else {
                try {
                    const res = await apiServer.getAction(id)
                    const { name, rowData } = res.data.data
                    this.reteData = JSON.parse(rowData)
                    this.name = name
                    this.onEditing = true
                    this.isError = false
                } catch (err) {
                    this.$notify({ title: 'Fail get task', text: ApiServer.errorToString(err), type: 'error' })
                }
            }

            this.isLoading = false
        },
        async getServices() {
            this.isLoading = true
            try {
                const remoteServices = await apiServer.getServiceList()
                this.services = remoteServices
            } catch (err) {
                this.services = {}
                this.$notify({ title: 'Fail to load services', text: ApiServer.errorToString(err), type: 'error' })
            }
            this.isLoading = false
        },
        async startEditor() {
            this.name = this.$refs.name.value
            this.onEditing = true
            this.isError = false
        },
        async onSave(saveData) {
            try {
                let res
                if (!this.id)
                    res = await apiServer.createAction(Converter.treat(this.name || `Task ${Math.random() * 10000}`, saveData))
                else
                    res = await apiServer.modifyAction(
                        this.id,
                        Converter.treat(this.name || `Task ${Math.random() * 10000}`, saveData)
                    )
                if (res.status === 200) this.$notify({ title: 'Save!', type: 'success' })
                else throw `Error, ${res.status} code`
                if (res?.data?.data?.id) {
                    this.$router.replace({ name: 'Editor', params: { id: res.data.data.id } })
                }
            } catch (err) {
                this.$notify({ title: 'Fail to save', text: ApiServer.errorToString(err), type: 'error' })
            }
        },
    },
}
</script>

<style scoped>
.w-min {
    width: min-content;
}
</style>
