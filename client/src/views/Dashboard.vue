<template>
    <Loading v-if="isLoading" />
    <div v-else-if="!tasks.length" class="hero min-h-full min-w-full">
        <div class="text-center hero-content">
            <div class="max-w-md">
                <h1 class="mb-5 text-5xl font-bold">No tasks yet</h1>
                <p class="mb-5">Go to the <b>Node editor</b> and create some new task. All your tasks will appear here.</p>
                <router-link class="btn btn-primary" :to="{ name: 'Editor' }">Get Started</router-link>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-wrap p-3">
        <div v-for="(item, index) in tasks" :key="index" class="w-full md:w-1/2 xl:w-1/3 p-2">
            <div class="card shadow bg-default">
                <div class="card-body flex flex-row items-center p-4">
                    <div class="pr-2">
                        <label class="cursor-pointer label">
                            <input type="checkbox" checked="checked" class="checkbox checkbox-primary" />
                            <span class="checkbox-mark"></span>
                        </label>
                    </div>
                    <div class="flex pr-2">
                        <button v-on:click="editAction(item._id)" class="btn btn-sm btn-square">
                            <Icon glyph="edit" class="inline-block w-6 h-6 stroke-current" />
                        </button>
                    </div>
                    <div class="flex pr-4">
                        <button v-on:click="deleteAction(item._id)" class="btn btn-sm btn-square">
                            <Icon glyph="close" class="inline-block w-6 h-6 stroke-current" />
                        </button>
                    </div>
                    <div class="flex-1 text-right md:text-center">
                        <h5 class="font-bold uppercase text-gray-600">Title</h5>
                        <h3 class="font-bold text-2xl">
                            {{ item.name }}
                        </h3>
                    </div>
                    <div v-if="alreadyRunned(item)" class="flex-1 text-right md:text-center">
                        <h5 class="font-bold uppercase text-gray-600">Last run</h5>
                        <p class="text-content-400">
                            {{ customDateFormat(item.runStats.lastTrigger) }}
                        </p>
                    </div>
                </div>
                <div class="flex p-1" v-bind:style="getBadgeColor(item)"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Converter from '../api/converter.api'
import { ApiServer, apiServer } from '../api/server.api'

export default {
    name: 'Dashboard',
    components: {},
    created() {
        this.isLoading = true
        apiServer
            .getActions()
            .then(res => {
                this.tasks = res.data.data
            })
            .catch(err => {
                this.$notify({ title: 'Fail to load actions', text: ApiServer.errorToString(err), type: 'error' })
            })
            .finally(() => {
                this.isLoading = false
            })
    },
    data() {
        return {
            isLoading: true,
            tasks: [],
            modal: false,
            selectedItem: 0,
        }
    },
    methods: {
        isRun(action) {
            return action.runStats
        },
        alreadyRunned(action) {
            return this.isRun(action) && action.runStats.lastTrigger
        },
        getBadgeColor(action) {
            if (this.isRun(action)) {
                switch (action.runStats.status) {
                    case 1:
                        return 'background-color: brown;'
                    case 2:
                        return 'background-color: green;'
                    case 3:
                        return 'background-color: red;'
                    case 4:
                        return 'background-color: yellow;'
                }
            }
            return 'background-color: grey;'
        },
        customDateFormat(dateIsoString) {
            return Converter.dateConvert(new Date(dateIsoString))
        },
        editAction(actionId) {
            this.$router.push({ name: 'Task', params: { id: actionId } })
        },
        deleteAction(actionId) {
            apiServer
                .deleteAction(actionId)
                .then(res => {
                    if (res.status === 200) {
                        this.$notify({ title: 'Was deleted', type: 'success' })
                        const tmp = this.tasks.filter(t => t._id != actionId)
                        this.tasks = tmp
                    } else throw 'Invalid answer'
                })
                .catch(err => {
                    this.$notify({ title: 'Fail to delete action', text: ApiServer.errorToString(err), type: 'error' })
                })
        },
    },
}
</script>
