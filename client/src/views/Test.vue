<template>
    <div class="home">
        <div class="nav2 text-content-900">
            <router-link to="/">Home</router-link> |
            <router-link :to="{ name: 'SignIn' }">Login</router-link> |
            <router-link :to="{ name: 'SignUp' }">Register</router-link> |
            <router-link :to="{ name: 'Dashboard' }">Dashboard</router-link> |
            <router-link :to="{ name: 'Editor' }">Editor</router-link> |
            <router-link :to="{ name: 'Account' }">Account</router-link> |
            <router-link :to="{ name: 'NotFound', params:{ catchAll: 'abc' } }">NotFound</router-link> |
            <router-link :to="{ name: 'About' }">About</router-link>
        </div>
        <div class="flex flex-wrap">
            <div v-for="icon in icons" :key="icon" class="flex flex-col items-center w-min m-2">
                <Icon :glyph="icon" class="inline-block w-6 h-6 stroke-current" />
                <label>{{ icon }}</label>
            </div>
        </div>
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
export default {
    name: 'Home',
    components: {},
    data() {
        return {
            icons: [ 'info', 'warning', 'arrow', 'close', 'invalid', 'bell', 'dots', 'code', 'eye', 'folder', 'menu', 'back', 'search', 'heart', 'check', 'adjustments', 'archive', 'book-open', 'color-swatch', 'document-add', 'lightning-bolt', 'inbox-in', 'template', 'menu-alt-2', 'edit', 'pen', 'home', 'profile', 'text'],
        }
    },
}
</script>

<style lang="stylus" scoped>
.w-min {
    width: min-content;
}

.home {
  text-align: center;
}

.nav2 {
  padding: 30px;

  a {
    font-weight: bold;
  }

  a.router-link-exact-active {
    color: #42b983;
  }
}
</style>
