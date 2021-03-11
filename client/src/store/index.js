import Vue from 'vue'
import Vuex from 'vuex'
import { apiServer } from '../api/server.api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        theme: '',
        user: { firstname: '', lastname: '' },
        serverUrl: '',
        services: [
            {
                name: 'discord',
                img: 'discord.svg',
                desc:
                    'Discord is the easiest way to talk over voice, video, and text. Talk, chat, hang out, and stay close with your friends and communities.',
            },
            {
                name: 'google',
                img: 'google.svg',
                desc:
                    "Search the world's information, including webpages, images, videos and more. Google has many special features to help you find exactly what you're looking ...",
            },
            {
                name: 'translate',
                img: 'translate.png',
                desc:
                    'Translate is a multilingual neural machine translation service, to translate text and websites from one language into another.',
            },
            {
                name: 'weather',
                img: 'weather.png',
                desc:
                    'Weather service provide access to current weather data, hourly, 5- and 16-day forecasts. Get the temperature, wind, presure all around the world.',
            },
            {
                name: 'youtube',
                img: 'youtube.svg',
                desc:
                    'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
            },
            {
                name: 'calendar',
                img: 'calendar.png',
                desc:
                    "Calendar is a time-management and scheduling calendar service. You can quickly schedule meetings and events and get reminders about upcoming activities, so you always know what's next.",
            },
            {
                name: 'dealabs',
                img: 'dealabs.svg',
                desc: 'The best place for Deals, Discounts & Freebies. Find daily great offers and voucher codes.',
            },
        ],
    },
    mutations: {
        setTheme(state, themeName) {
            state.theme = themeName || ''
        },
        setUser(state, user) {
            const { firstname = '', lastname = '' } = user
            state.user = { firstname, lastname }
        },
        setServerUrl(state, url) {
            state.serverUrl = url || ''
            apiServer.changeUrl(url || '')
        },
    },
    actions: {
        async loadTheme({ commit }) {
            const theme = localStorage.getItem('area-theme-ui')
            if (theme && typeof theme === 'string') {
                commit('setTheme', theme)
                return theme
            }
            return undefined
        },
        changeTheme({ commit }, themeName) {
            localStorage.setItem('area-theme-ui', themeName)
            const el = document.getElementsByTagName('html')[0]
            el.dataset.theme = themeName
            commit('setTheme', themeName)
        },
        async loadUser({ commit }) {
            const user = localStorage.getItem('area-user')
            if (user && typeof user === 'string') {
                commit('setUser', JSON.parse(user))
            }
        },
        changeUser({ commit }, user) {
            localStorage.setItem('area-user', JSON.stringify(user))
            commit('setUser', user)
        },
        async loadServerUrl({ commit }) {
            const url = localStorage.getItem('area-server-url')
            if (url && typeof url === 'string') {
                commit('setServerUrl', url)
            }
        },
        changeServerUrl({ commit }, url) {
            localStorage.setItem('area-server-url', url)
            commit('setServerUrl', url)
        },
    },
    modules: {},
})
