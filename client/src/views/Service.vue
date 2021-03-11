<template>
    <Loading v-if="isLoading" />
    <p404 v-else-if="isError" />
    <div v-else class="card bordered shadow bg-default m-6">
        <form class="card-body" @submit.prevent="onSave">
            <div class="flex justify-center w-full sm:hidden">
                <img class="service-icon" :src="require(`@/assets/icon-${lService.img}`)" />
            </div>
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="my-4 text-4xl font-bold card-title capitalize">{{ this.id }}</h2>
                    <div class="mb-2 space-x-2 card-actions flex-wrap">
                        <div
                            class="badge mb-2"
                            :class="{ 'badge-success': rService.active.value, 'badge-error': !rService.active.value }"
                        >
                            {{ rService.active.value ? 'activate' : 'deactivate' }}
                        </div>
                        <div class="badge badge-ghost mb-2">Service</div>
                        <div class="badge badge-ghost mb-2">Connective</div>
                        <div class="badge badge-ghost mb-2">Free</div>
                    </div>
                </div>
                <img class="service-icon hidden sm:inline" :src="require(`@/assets/icon-${lService.img}`)" />
            </div>
            <p class="sm:pr-32">{{ lService.desc }}</p>
            <div class="py-2">
                <div class="py-2 text-xs capitalize opacity-50">
                    <div class="inline-block select-none">
                        <Icon glyph="code" class="inline-block w-4 mr-2 stroke-current" />
                    </div>
                    Service
                </div>
                <div class="flex flex-col space-y-2 max-w-xs" v-for="(item, index) in rService" :key="index">
                    <div v-if="!item.hidden" class="form-control">
                        <label v-if="!isCustom(item)" class="label">
                            <span class="label-text">{{ item.name }}</span>
                        </label>
                        <button v-if="isCustom(item)" @click="onCallbackBtn(item)" class="btn btn-primary my-4">
                            {{ item.name }}
                        </button>
                        <label v-else-if="item.type == 'checkbox'">
                            <input
                                type="checkbox"
                                :checked="item.value ? 'checked' : ''"
                                :disabled="item.disabled"
                                :ref="index"
                                class="toggle toggle-primary"
                            />
                            <span class="toggle-mark"></span>
                        </label>
                        <input
                            v-else
                            :type="item.type"
                            :placeholder="item.placeholder"
                            :value="item.value"
                            :disabled="item.disabled"
                            :ref="index"
                            class="input input-primary input-bordered w-full"
                        />
                        <label class="label pb-0" v-if="item.tips">
                            <span></span>
                            <span class="label-text-alt">{{ item.tips }}</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="justify-end space-x-2 card-actions">
                <input type="submit" value="Save" class="btn btn-primary w-auto" />
                <button disabled="disabled" class="btn">Remove</button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { ApiServer, apiServer } from '../api/server.api.js'

export default {
    name: 'Service',
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
            isLoading: true,
            isError: false,
            lService: {},
            rService: {},
        }
    },
    computed: {
        ...mapState({
            localServices: 'services',
        }),
    },
    created() {
        this.getService(this.id)
    },
    methods: {
        onIdUpdate() {
            this.getService(this.id)
        },
        /** @param {string} id */
        async getService(id) {
            this.isLoading = true
            try {
                const service = this.localServices.find((el) => el.name === id)
                const remoteServices = await apiServer.getServiceList()
                if (!service?.name || !remoteServices[service.name]) throw Error("Service doesn't exist")
                this.isError = false
                this.lService = service
                this.rService = remoteServices[service.name]
            } catch (err) {
                this.isError = true
                this.lService = {}
                this.rService = {}
                this.$notify({ title: 'Service not found', text: ApiServer.errorToString(err), type: 'error' })
            }
            this.isLoading = false
        },
        isCustom(item) {
            return item.type == 'google'
        },
        onCallbackBtn(item) {
            if (item.type == 'google') apiServer.addGoogleService()
        },
        async onSave() {
            if (this.isError || this.rService == {}) return

            const serviceData = {}
            for (const field in this.rService) {
                if (!this.$refs[field]) continue
                const input = this.$refs[field][0]

                if (this.rService[field].type == 'checkbox') {
                    serviceData[field] = { value: input.checked }
                } else if (this.rService[field].type == 'input') {
                    serviceData[field] = { value: input.value }
                }
            }

            try {
                await apiServer.enableService(this.lService.name, serviceData)
            } catch (err) {
                this.$notify({ title: 'Service not found', text: ApiServer.errorToString(err), type: 'error' })
            }
            this.getService(this.id)
        },
    },
}
</script>

<style scoped>
.service-icon {
    max-width: 8rem;
    max-height: 8rem;
}
</style>
