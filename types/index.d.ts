import type BuilderApi from "#build/builder/builderApi";

export {};



declare global {
    interface Window {
        md5: (v: string) => {},
        createCanvas: (document: any) => document,
        BABYLON: any
        THREE: any
        GradientEquirectTexture: any
        WebGLPathTracer: any
        getScaledSettings: any
        BuilderApi: BuilderApi
    }
}
