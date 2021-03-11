<template>
    <div class="hero min-h-full bg-content-200">
        <div class="flex-col justify-center hero-content lg:flex-row">
            <div class="text-center lg:text-left">
                <h1 class="mb-5 text-5xl font-bold">Welcome back to Area</h1>
                <p class="mb-5">Sign in to your account.</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-default">
                <form class="card-body" @submit.prevent="signIn">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input
                            class="input w-full input-bordered focus:border-blue-600"
                            type="email"
                            placeholder="email"
                            ref="emailInput"
                            required
                        />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Password</span>
                        </label>
                        <input
                            class="input w-full input-bordered focus:border-blue-600"
                            type="password"
                            placeholder="password"
                            ref="passwordInput"
                            required
                        />
                        <label class="label">
                            <router-link to="register" class="label-text-alt">Don't have an account? <b>Sign up</b>.</router-link>
                        </label>
                        <label class="label pt-1 pb-0">
                            <router-link to="setting" class="label-text-alt">Wrong server location? <b>Change</b>.</router-link>
                        </label>
                    </div>
                    <GoogleBtn class="mt-6" />
                    <div class="form-control mt-6">
                        <input class="btn btn-primary w-full" type="submit" value="Login" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ApiServer, apiServer } from '../api/server.api'

export default {
    name: 'SignIn',
    components: {},
    created() {
        if (this.$route.query.error) {
            this.$notify({
                title: 'Fail to login',
                text: this.$route?.query?.error,
                type: 'error',
            })
        }
    },
    methods: {
        signIn() {
            const email = this.$refs.emailInput.value
            const pswd = this.$refs.passwordInput.value

            apiServer
                .logIn(email, pswd)
                .then((res) => {
                    this.updateUserInfo(email)
                    this.$router.push({ name: 'Dashboard' })
                })
                .catch((err) => {
                    this.$notify({
                        title: 'Fail to login',
                        text: ApiServer.errorToString(err),
                        type: 'error',
                    })
                })
            // TODO: remove me (debug)
            // document.cookie = `Authorization=abc; Max-Age=${60 * 60 * 12}; SameSite=Strict; path=/`
            // this.$router.push({ name: 'Dashboard' })
        },
        updateUserInfo(email = '') {
            try {
                const [fname, lname] = email.split('@')[0].split('.')
                this.$store.dispatch('changeUser', { firstname: fname, lastname: lname })
            } catch (err) {}
        },
    },
}
</script>

<style></style>
