import './plugins'
import './register-components'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.css'

// Development only
/*const ignoredMessage = /The \.native modifier for v-on is only valid on components but it was used on <.+?>\./
Vue.config.warnHandler = (message, vm, componentTrace) => {
    if (!ignoredMessage.test(message)) {
        console.error(message + componentTrace)
    }
}*/

Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
