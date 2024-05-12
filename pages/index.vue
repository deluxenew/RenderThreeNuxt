<template>
    <UContainer class="flex gap-4">
        <UButton @click="onSend">Send</UButton>

        <img v-if="img" :src="img" alt="render"/>
    </UContainer>
</template>

<script setup lang="ts">
defineOptions({
    name: 'IndexRender'
})
const img = ref('')
// const eventSource = ref<EventSource>()

async function onSend() {
    // eventSource.value = new EventSource('http://localhost:3000/websocket')
    //
    // if ("onmessage" in eventSource.value) {
    //     eventSource.value.onmessage = (event) => {
    //         console.log(event.data)
    //     }
    // }

    const data = await $fetch('/api/test', {
        method: 'post',
        body: {d: 213}
    })
    if (typeof data === "string") {
        img.value = `data:image/png;base64, ${data}`
    }

    // eventSource.value?.close()
}

</script>

