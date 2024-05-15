<template>

</template>

<script setup lang="ts">
definePageMeta({
    layout: 'clean'
})

onBeforeUnmount(() => {
    const canvas = document.getElementsByTagName('canvas')[0]
    if (canvas) canvas.remove()
})
</script>
