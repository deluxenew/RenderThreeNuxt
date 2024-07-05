<template>
    <UContainer class="flex gap-4">
        <UButton @click="onSend">Get render</UButton>


    </UContainer>

    <u-container>
        <img v-if="img" :src="img" alt="render"/>
    </u-container>
</template>

<script setup lang="ts">

defineOptions({
    name: 'IndexRender'
})
const img = ref('')
const eventSource = ref<EventSource>()

async function onSend() {
    // eventSource.value = new EventSource('http://localhost:3000/api/test')
    //
    // if ("onmessage" in eventSource.value) {
    //     eventSource.value.onmessage = (event) => {
    //         console.log(event.data)
    //     }
    // }

    const {data} = await useFetch('/api/test', {
        method: 'post',
        body: {camera: {
                position: {
                    y: 3
                }
            }}
    })
    if (typeof data.value === "string") {
        img.value = `data:image/png;base64, ${data}`
    }

    // eventSource.value?.close()
}
</script>

