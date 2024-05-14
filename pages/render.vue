<template>

</template>

<script setup lang="ts">
definePageMeta({
    layout: 'clean'
})
import * as THREE from 'three';
import {GradientEquirectTexture, WebGLPathTracer} from '../renderer/index.module';
import {getScaledSettings} from '../renderer/getScaledSettings.js';


// init scene, renderer, camera, controls, etc

const test = ref('')

onBeforeUnmount(() => {
    const canvas = document.getElementsByTagName('canvas')[0]
    if (canvas) canvas.remove()
})
</script>

<style scoped>

</style>
