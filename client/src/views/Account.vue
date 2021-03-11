<template>
    <div class="relative">
        <div class="grid grid-cols-1 items-center gap-6 p-4 lg:p-6 md:grid-cols-3 xl:grid-cols-4">
            <div class="card row-span-2 bordered shadow-lg compact bg-default">
                <figure><img src="https://i.ibb.co/LrRHMWJ/mouais2.jpg" /></figure>
                <div class="flex-row items-center space-x-4 card-body">
                    <div>
                        <h2 class="card-title capitalize">{{ user.firstname }} {{ user.lastname }}</h2>
                        <p class="text-content-500">Direct Interactions Liaison</p>
                    </div>
                </div>
            </div>
            <div class="card bordered shadow-lg compact bg-default">
                <div class="card-body">
                    <div class="flex flex-wrap justify-evenly py-4">
                        <button @click="clearCookies" class="btn btn-secondary m-1">Remove cookies</button>
                        <button @click="logout" class="btn border-none m-1 text-white bg-red-700 hover:bg-red-800">Logout</button>
                    </div>
                </div>
            </div>
            <ServerLocation />
            <div class="card shadow-lg compact bg-default">
                <div class="flex-row items-center space-x-4 card-body">
                    <label class="flex-0"
                        ><div>
                            <input type="checkbox" checked="checked" class="toggle toggle-primary" />
                            <span class="toggle-mark"></span></div
                    ></label>
                    <div class="flex-1">
                        <h2 class="card-title">Enable Notifications</h2>
                        <p class="text-base-content text-opacity-40">To get latest updates</p>
                    </div>
                </div>
            </div>
            <router-link
                v-for="(item, index) in services"
                :key="index"
                :to="{ name: 'Service', params: { id: item.name } }"
                class="btn btn-secondary card bordered shadow-lg compact bg-default text-content-900"
            >
                <div class="card-body flex justify-center">
                    <img class="h-32 w-32" :src="require(`@/assets/icon-${item.img}`)" />
                    <p class="pt-3">{{ item.name }}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Account',
    computed: {
        ...mapState({
            services: 'services',
            user: 'user',
        }),
    },
    methods: {
        logout() {
            document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
            this.$router.push({ name: 'SignIn' })
        },
        clearCookies() {
            document.cookie.split(';').forEach((c) => {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
            })
        },
    },
}
</script>

<style scoped>
.compact {
    height: min-content;
}
</style>
