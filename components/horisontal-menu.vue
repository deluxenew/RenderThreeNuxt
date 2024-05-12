<template>
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800"/>
</template>

<script setup lang="ts">
const links = [{
    label: 'Main',
    icon: 'i-heroicons-home',
    to: '/'
}, {
    label: 'Render',
    icon: 'i-heroicons-film-16-solid',
    to: '/render'
}, {
    label: 'Constructor',
    icon: 'i-heroicons-wrench-screwdriver-20-solid',
    to: '/constructor',
    dynamic: true
}]
</script>
