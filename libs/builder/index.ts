import type {BuildConfig, SceneBuilderTypes} from "./types";
import {prepareRoom, prepareScene} from "./helpers";
import type {Scene} from "three";
import {Group} from "three";

export default class SceneBuilder implements  SceneBuilderTypes {
    public scene: Scene | null = null
    public room: Group | null = null

    constructor(buildConfig: BuildConfig | null) {
        const { sceneConfig, roomConfig} = buildConfig || {}
        if (sceneConfig) this.scene = prepareScene(sceneConfig)
        if (roomConfig) this.room = prepareRoom(roomConfig)
    }
}
