import type {BuilderServer} from "./types";
import {
    Scene,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    BoxGeometry,
    PerspectiveCamera,
    ACESFilmicToneMapping,
    WebGLRenderer,
    SpotLight
} from 'three'
import type {BuildRequest} from "~/types/requestTypes";

export default class BuilderApi implements BuilderServer.Api {

    public configReactive: BuildRequest | null = null

    public getRenderer(): WebGLRenderer {
        const renderer: WebGLRenderer = new WebGLRenderer({antialias: true});
        renderer.toneMapping = ACESFilmicToneMapping;
        return renderer
    }

    public getScene(): Scene | undefined {
        if (!this.configReactive) return;
        const scene = new Scene()
        const sphereGeom = new SphereGeometry(0.49, 64, 32);
        const ball1 = new Mesh(
            sphereGeom,
            new MeshStandardMaterial({
                color: '#e91e63',
                roughness: 0.25,
                metalness: 1,
            })
        );
        const ball2 = new Mesh(
            sphereGeom,
            new MeshStandardMaterial({
                color: '#ff9800',
                roughness: 0.1,
                metalness: 1,
            })
        );
        ball2.castShadow = true

        const material = new MeshStandardMaterial({
            color: '#2196f3',
            roughness: 0.2,
            metalness: 0,
        })
// material.castShadow = false
        const ball3 = new Mesh(
            sphereGeom,
            material
        );

        ball3.castShadow = false
        const ground = new Mesh(
            new BoxGeometry(3.5, 0.1, 1.5),
            new MeshStandardMaterial(),
        );
        ground.receiveShadow = true
        const newLight = new SpotLight(0x2196f3, 2);

        ball1.position.x = -1;
        ball3.position.x = 1;
        ground.position.y = -0.54;
        scene.add(ball1, ball2, ball3, ground, newLight);

        const texture = new window.GradientEquirectTexture();
        if ("bottomColor" in texture && 'topColor' in texture) {
            texture.topColor.set(0xffffff);
            texture.bottomColor.set(0x666666);
        }

        texture.update();
        scene.environment = texture;
        scene.background = texture;
        return scene
    }
    constructor(buildConfig: BuildRequest) {
        this.configReactive = reactive(buildConfig)
    }

    public getCamera(): PerspectiveCamera | undefined {
        if (!this.configReactive) return;
        const camera = new PerspectiveCamera();
        camera.position.set(0, this.configReactive.camera.position.y, -5);
        camera.lookAt(0, 0, 0);
        return camera
    }
}