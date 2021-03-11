<template>
    <div class="hero min-h-full bg-content-200">
        <div class="flex-col justify-center hero-content lg:flex-row">
            <div class="text-center lg:text-left">
                <h1 class="mb-5 text-5xl font-bold">Welcome to Area</h1>
                <p class="mb-5">Sign up to your account.</p>
            </div>
            <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-default">
                <form class="card-body" @submit.prevent="signUp">
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
                            minlength="4"
                            maxlength="20"
                            ref="passwordInput"
                            required
                        />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Confirm password</span>
                        </label>
                        <input
                            class="input w-full input-bordered focus:border-blue-600"
                            type="password"
                            placeholder="password"
                            minlength="4"
                            maxlength="20"
                            ref="confirmPassword"
                            required
                        />
                        <label class="label">
                            <router-link to="login" class="label-text-alt">You have an account? <b>Sign in</b>.</router-link>
                        </label>
                        <label class="label pt-1 pb-0">
                            <router-link to="setting" class="label-text-alt">Wrong server location? <b>Change</b>.</router-link>
                        </label>
                    </div>
                    <GoogleBtn class="mt-6" />
                    <div class="form-control mt-6">
                        <input class="btn btn-primary w-full" type="submit" value="Sign up" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ApiServer, apiServer } from '../api/server.api'

export default {
    name: 'SignUp',
    components: {},
    methods: {
        signUp() {
            const email = this.$refs.emailInput.value
            const pswd = this.$refs.passwordInput.value

            if (pswd != this.$refs.confirmPassword.value) {
                this.$notify({
                    title: 'Fail to register',
                    text: 'Passwords are different',
                    type: 'error',
                })
                return
            }
            apiServer
                .signUp(email, pswd)
                .then((res) => {
                    this.updateUserInfo(email)
                    this.$router.push({ name: 'Dashboard' })
                })
                .catch((err) => {
                    this.$notify({
                        title: 'Fail to register',
                        text: ApiServer.errorToString(err),
                        type: 'error',
                    })
                })
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
