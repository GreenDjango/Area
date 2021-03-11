<template>
    <div class="relative">
        <div class="grid grid-cols-1 items-center gap-6 p-4 lg:p-6 md:grid-cols-3 xl:grid-cols-4">
            <div class="card bordered shadow-lg compact bg-default">
                <div class="card-body">
                    <div class="flex flex-wrap justify-evenly py-4">
                        <button @click="clearCookies" class="btn btn-primary m-1">Remove cookies</button>
                    </div>
                </div>
            </div>
            <ServerLocation />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Setting',
    methods: {
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
