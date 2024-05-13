import type SceneBuilder from "#build/libs/builder";
import * as THREE from "three";

export {};

declare global {
    interface Window {
        sceneBuilder: SceneBuilder;
        md5: (v: string) => {},
        createCanvas: (document: any) => document,
        BABYLON: any
        THREE: any
    }
}
