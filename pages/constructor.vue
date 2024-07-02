<template>
    <div >
<!--        <canvas class="h-[600px] w-[800px]" id="canvas"/>-->
    </div>
</template>

<script setup lang="ts">


onMounted(async () => {



    const builder = new window.BuilderApi({
        // camera: {
        //     position: {
        //         y: 3
        //     }
        // }
    })
    await builder.startRenderer(false)



})

</script>

<style scoped>

</style>
