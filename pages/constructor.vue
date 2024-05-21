<template>
    <div>
        <canvas id="canvas"/>
    </div>
</template>

<script setup lang="ts">
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';


onMounted(async () => {



    const builder = new window.BuilderApi({
        camera: {
            position: {
                y: 3
            }
        }
    })
    await builder.startRenderer(true)



})

</script>

<style scoped>

</style>
