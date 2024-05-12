import type {SceneConfig, RoomConfig} from "./types";
import {Group, Scene} from "three";

export const prepareScene = (config: SceneConfig) => {
    const scene = new Scene();
    return scene
}

export const prepareRoom = (config: RoomConfig) => {
    return new Group()
}
