<template>
    <div id="app" class="bg-content-200">
        <notifications />
        <Header v-show="hasVisibleNav" class="w-full z-10" />
        <main
            v-bind:class="{ 'main-margin': hasVisibleNav && !isRoot, 'main-half-margin': hasVisibleNav && isRoot }"
            class="text-content-900"
        >
            <router-view />
        </main>
        <Nav v-show="hasVisibleNav" v-if="!isRoot" class="w-full z-10" />
    </div>
</template>

<script>
import { Plugins, Capacitor } from '@capacitor/core'
const { StatusBar, Toast } = Plugins

export default {
    async beforeCreate() {
        this.$store.dispatch('loadUser')
        this.$store.dispatch('loadServerUrl')
        this.$store.dispatch('loadTheme').then((theme) => {
            if (theme) this.$store.dispatch('changeTheme', theme)
        })
    },
    created() {
        window.addEventListener('orientationchange', this.updateVisibleNav)
        this.updateVisibleNav()
    },
    data() {
        return {
            hasVisibleNav: true,
            platform: Capacitor.getPlatform(),
        }
    },
    computed: {
        isRoot() {
            return this.$route.path === '/'
        },
    },
    methods: {
        isMobilePlatform() {
            return this.platform === 'android' || this.platform === 'ios'
        },
        hideStatusBar() {
            StatusBar.hide()
        },
        showStatusBar() {
            StatusBar.show()
        },
        show(msg) {
            Toast.show({ text: msg, duration: 'long', position: 'center' })
        },
        updateVisibleNav() {
            if (!this.isMobilePlatform()) return

            const orientationType = screen.orientation.type
            if (orientationType === 'landscape-primary' || orientationType === 'landscape-secondary') {
                this.hasVisibleNav = false
            } else {
                this.hasVisibleNav = true
            }
        },
    },
}
</script>

<style lang="stylus">
html, body, #app {
  height: 100%;
}

@css {
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--c4,174 60% 41%)) hsl(var(--c2,174 60% 51%));
    scroll-behavior: smooth;
  }
}

main {
  overflow: auto;
}

.main-margin {
  height: calc(100% - 128px);
}

.main-half-margin {
  height: calc(100% - 64px);
}
</style>
