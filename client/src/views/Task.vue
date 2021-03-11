<template>
    <p404 v-if="isError" />
    <Loading v-else-if="isLoading" />

    <div v-else class="card bordered shadow bg-default m-6">
        <div class="flex-col card-body divide-y">
            <div class="flex mb-4 flex-row space-x-4 w-full items-center">
                <label class="flex justify-center">
                    <input
                        @change="changeState"
                        :disabled="checkboxDisable"
                        type="checkbox"
                        v-model="task.enable"
                        class="toggle toggle-primary"
                    />
                    <span class="toggle-mark"></span>
                </label>
                <p class="card-title text-center m-0 p-0">'{{ task.name }}'</p>
            </div>
            <div v-if="task._id" class="py-4">
                <h1 class="card-title">Global:</h1>
                <p>id: {{ task._id }}</p>
                <p>version: {{ customDateFormat(task.currentVersion) }}</p>
            </div>
            <div v-if="task.runStats" class="py-4">
                <h1 class="card-title">Current runned:</h1>
                <p>status: {{ getStatus(task) }}</p>
                <p v-if="task.runStats.msgIfError">error: {{ task.runStats.msgIfError }}</p>
                <p>version: {{ customDateFormat(task.runStats.runnedVersion) }}</p>
                <p>type: {{ task.runStats.triggerType }}</p>
            </div>
            <router-link class="btn" :to="{ name: 'Editor', params: { id: this.task._id } }">
                Update schema
            </router-link>
        </div>
    </div>
</template>

<script>
import Converter from '../api/converter.api.js'
import { apiServer } from '../api/server.api.js'

export default {
    name: 'Task',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    watch: {
        id: 'onIdUpdate',
    },
    data() {
        return {
            isError: false,
            task: {},
            checkboxDisable: false,
            isLoading: true
        }
    },
    created() {
        this.getTask(this.id)
    },
    methods: {
        onIdUpdate() {
            console.log(`New id: ${this.id}`)
            this.getTask(this.id)
        },
        /** @param {string} id */
        getTask(id) {
            this.isLoading = true
            apiServer
                .getAction(id)
                .then(res => {
                    if (res.status === 200) this.task = res.data.data
                    this.isLoading = false
                })
                .catch(() => {
                    this.isError = true
                })
        },
        async changeState() {
            this.checkboxDisable = true
            new Promise(resolve => setTimeout(resolve, 3000)).then(() => (this.checkboxDisable = false))

            apiServer
                .modifyAction(this.task._id, { enable: this.task.enable })
                .then(res => {
                    if (res.status !== 200) throw 'Invalid answer'
                    this.getTask(this.id)
                })
                .catch(err => {
                    this.task.enable = !this.task.enable
                    console.log({ err })
                    this.$notify({
                        title: 'Fail to update',
                        text: !err || !err.response ? err : err.response.data,
                        type: 'error',
                    })
                })
        },
        customDateFormat(dateIsoString) {
            return Converter.dateConvert(new Date(dateIsoString))
        },
        getStatus(action) {
            if (action.runStats) {
                switch (action.runStats.status) {
                    case 1:
                        return 'builded'
                    case 2:
                        return 'started'
                    case 3:
                        return 'stoped'
                    case 4:
                        return 'crashed'
                }
            }
            return 'none'
        },
    },
}
</script>

<style scoped></style>
