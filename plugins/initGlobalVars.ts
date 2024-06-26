import * as THREE from 'three'
import {GradientEquirectTexture, WebGLPathTracer} from '../renderer/index.module';
import {getScaledSettings} from '../renderer/getScaledSettings.js';
import BuilderApi from "../builder/builderApi";
export default defineNuxtPlugin((nuxt) => {
    if (typeof window !== "undefined") {
        window.THREE = THREE
        window.GradientEquirectTexture = GradientEquirectTexture
        window.WebGLPathTracer = WebGLPathTracer
        window.getScaledSettings = getScaledSettings
        window.BuilderApi = BuilderApi
    }
})
