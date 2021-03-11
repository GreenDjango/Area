<template>
    <nav class="flex flex-col space-y-2">
        <div class="py-2 artboard artboard-demo bg-content-100">
            <ul class="menu px-3 shadow-lg bg-default text-content-700 rounded-2xl horizontal">
                <li>
                    <router-link :to="{ name: 'Dashboard' }">
                        <Icon glyph="home" class="inline-block w-6 h-6 stroke-current" />
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'Editor' }">
                        <Icon glyph="code" class="inline-block w-6 h-6 stroke-current" />
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'Account' }">
                        <Icon glyph="profile" class="inline-block w-6 h-6 stroke-current" />
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Nav',
}
</script>

<style scoped>
.router-link-active {
    color: hsla(var(--p2, 259 94% 51%) / var(--tw-text-opacity, 1));
}
</style>
