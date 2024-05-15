import type { Scene, WebGLRenderer} from "three";
import {PerspectiveCamera} from "three";

export namespace BuilderServer {
    export interface Api {
        getScene: () => Scene | undefined
        getCamera: () => PerspectiveCamera | undefined
        getRenderer: () => WebGLRenderer
    }
}
