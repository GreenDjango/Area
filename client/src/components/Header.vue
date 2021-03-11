<template>
    <div class="navbar bg-content-800 text-content-100">
        <div class="flex-none">
            <button v-on:click="reloadPage" class="btn btn-square btn-ghost">
                <img :src="`${publicPath}img/icons/android-chrome-256x256.png`" class="inline-block w-10 h-10" />
            </button>
        </div>
        <div class="flex-1 px-2 mx-2">
            <span class="text-lg font-bold"> Area </span>
        </div>
        <div class="flex-none">
            <button @click="switchTheme" class="btn btn-square btn-ghost">
                <Icon glyph="color-swatch" class="inline-block w-6 h-6 stroke-current" />
            </button>
        </div>
        <div v-if="isAuthRoute" @click="goAccount" class="avatar placeholder cursor-pointer">
            <div :class="{ 'bg-content-300': !accountPicture }" class="text-content-700 rounded-full w-10 h-10 m-1">
                <img v-if="accountPicture" :src="accountPicture" />
                <span v-else class="uppercase">{{ userName }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Header',
    data() {
        return {
            publicPath: process.env.BASE_URL,
            themes: ['light', 'dark', 'valentine', 'retro', 'synthwave', 'cyberpunk', 'black', 'dracula', 'garden'],
            themeIndex: 0,
            accountPicture: '', //'https://i.ibb.co/LrRHMWJ/mouais2.jpg',
        }
    },
    computed: {
        ...mapState({
            user: 'user',
        }),
        userName() {
            const fname = this.user?.firstname
            const lname = this.user?.lastname
            if (fname && lname) return fname[0] + lname[0]
            if (fname) return fname[0] + fname[1]
            if (lname) return lname[0] + lname[1]
            return 'MX'
        },
        isAuthRoute() {
            return this.$route.meta?.needAuth || false
        },
    },
    methods: {
        switchTheme() {
            this.themeIndex++
            if (!this.themes[this.themeIndex]) this.themeIndex = 0
            this.$store.dispatch('changeTheme', this.themes[this.themeIndex])
        },
        reloadPage() {
            window.location.replace('/')
        },
        goAccount() {
            this.$router.push({ name: 'Account' })
        },
    },
}
</script>
