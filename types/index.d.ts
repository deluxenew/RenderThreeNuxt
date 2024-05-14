import type SceneBuilder from "#build/libs/builder";

export {};

declare global {
    interface Window {
        sceneBuilder: SceneBuilder;
        md5: (v: string) => {},
        createCanvas: (document: any) => document,
        BABYLON: any
        THREE: any
        GradientEquirectTexture: any
        WebGLPathTracer: any
        getScaledSettings: any
    }
}
