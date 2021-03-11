<template>
    <div class="card shadow-lg compact bg-default">
        <div class="flex-col items-center space-y-2 card-body">
            <h2 class="card-title">Change server location</h2>
            <form class="relative w-full" @submit.prevent="changeServerLocation">
                <input
                    type="url"
                    ref="serverURL"
                    :value="serverUrl"
                    placeholder="http://localhost:8080"
                    class="w-full pr-16 input input-primary input-bordered"
                />
                <input type="submit" value="save" class="absolute w-auto right-0 rounded-l-none btn btn-primary" />
            </form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'ServerLocation',
    computed: {
        ...mapState({
            serverUrl: 'serverUrl',
        }),
    },
    methods: {
        changeServerLocation() {
            const serverUrl = this.$refs.serverURL.value
            this.$store.dispatch('changeServerUrl', serverUrl)
        },
    },
}
</script>
