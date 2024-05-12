import type SceneBuilder from "#build/libs/builder";

export {};

declare global {
    interface Window {
        sceneBuilder: SceneBuilder;
    }
}
