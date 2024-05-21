import type {Object3D, Scene} from "three";

export interface BuildRequest {
    obj: Object3D
    camera: {
        position: {
            y: number
        }
    }
}
