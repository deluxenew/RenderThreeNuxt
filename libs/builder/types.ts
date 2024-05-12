import type {Group, Scene} from "three";

export interface SceneBuilderTypes {
    scene: null | Scene

}

export interface SceneConfig {
    texture: string
}

export interface RoomConfig {
    walls: Group[]
}

export interface BuildConfig {
    sceneConfig: SceneConfig
    roomConfig: RoomConfig
}


