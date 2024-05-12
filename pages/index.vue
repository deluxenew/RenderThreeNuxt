<template>
    <UContainer class="flex gap-4">

        <UButton @click="onSend">Send</UButton>
        <UButton @click="onConnect">Connect</UButton>
        <UButton @click="onClose">Connect</UButton>

        <img :src="img" alt="render"/>
    </UContainer>
</template>

<script setup lang="ts">
defineOptions({
    name: 'IndexRender'
})
const img = ref('')
const eventSource = ref<EventSource>()

async function onSend() {
    const {data} = await useFetch('/api/test')
    if (typeof data.value === "string") {
        img.value = `data:image/png;base64, ${data.value}`
    }
}

async function onConnect() {

    eventSource.value = new EventSource('http://localhost:3000/websocket')

    if ("onmessage" in eventSource.value) {
        eventSource.value.onmessage = (event) => {
            console.log(event.data)
        }
    }


}

async function onClose() {
    eventSource.value?.close()
}
</script>

