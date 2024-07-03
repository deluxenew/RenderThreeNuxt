import type {BuilderServer} from "./types";
import {
    ACESFilmicToneMapping,
    BoxGeometry, BufferGeometry,
    Color,
    CubeReflectionMapping,
    CubeTextureLoader, DirectionalLight,
    ImageLoader,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    NearestFilter,
    Object3D,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    Vector2,
    WebGLRenderer,
    PointLight
} from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {BuildRequest} from "~/types/requestTypes"
import getBoxBufferGeometry from "~/builder/builderApi/models/getBoxBufferGeometry";


interface InnerObject extends Object3D {
    geometry?: BufferGeometry
    material?: MeshStandardMaterial
    children: InnerObject[]
}

export default class BuilderApi implements BuilderServer.Api {

    public configReactive: BuildRequest | null = null

    public getRenderer(): WebGLRenderer {
        const renderer: WebGLRenderer = new WebGLRenderer({antialias: true});
        renderer.toneMapping = ACESFilmicToneMapping;
        return renderer
    }

    public async getScene(): Promise<Scene | undefined> {
        if (!this.configReactive) return;
        const scene = new Scene()

        const loader = new GLTFLoader()

        const gltf = await loader.loadAsync('room.glb')
        const bottom1 = await loader.loadAsync('400.glb')

        const bottom2 = await loader.loadAsync('800.glb')
        const top1 = await loader.loadAsync('400u.glb')
        const top2 = await loader.loadAsync('800u.glb')
        const tabletop = await loader.loadAsync('tabletop.glb')
        const shadowLight = new DirectionalLight(0xffffff, 0.6)
        shadowLight.position.set(2.1,0,0)
        shadowLight.castShadow = true
        shadowLight.shadow.camera.left = -50
        shadowLight.shadow.camera.right = 50
        shadowLight.shadow.camera.top = 50
        shadowLight.shadow.camera.bottom = -50
        shadowLight.shadow.camera.near = 1
        shadowLight.shadow.radius = 1
        shadowLight.shadow.bias = -0.0001
        shadowLight.shadow.camera.far = 1000
        shadowLight.shadow.mapSize.width = 2048 // default is 512
        shadowLight.shadow.mapSize.height = 2048 // default is 512

        // const spotLight = new PointLight(0xffffff, 0.5)
        // spotLight.name = 'Spot Light'
        // // spotLight.angle = Math.PI / 2
        // // spotLight.penumbra = 0.3
        // spotLight.position.set(0, 5 , 0)

        if (gltf) {
            console.log(gltf)


            // gltf.scene.scale.set(0.5, 0.5, 0.5)
            console.log(gltf.scene.children.map(({name}) => name))
            gltf.scene.children.forEach((obj: InnerObject) => {


                if ([
                    'Room',
                    'Windows',
                    'Windows_Frames',

                ].includes(obj.name)) {
                    if ( obj.name === 'Windows_Frames' && obj.material) {
                        obj.position.z -= 0.12
                    }
                    if ( obj.name === 'Windows' && obj.material) {
                        console.log(obj.geometry)
                        obj.position.z -= 0.031


                        obj.material.color = new Color(0,0,0)
                        obj.material.emissive = new Color(0.4,0.4,0.4)

                        const newMesh = getBoxBufferGeometry()
                        gltf.scene.add(newMesh)
                    }

                    if (obj.name === 'Room') {
                        // obj.position.y = -1
                        console.log(obj.children)
                        const loader = new CubeTextureLoader()

                        const urls = []
                        for (let i = 0; i < 6; i++) {
                            urls.push('plitkarepeat.png')
                        }
                        const texture = loader.load(urls)
                        const newMaterial = new MeshStandardMaterial({
                            map: texture
                        })

                        texture.wrapS = RepeatWrapping
                        texture.wrapT = RepeatWrapping
                        texture.magFilter = NearestFilter
                        texture.mapping = CubeReflectionMapping
                        texture.offset = new Vector2(2,2)
                        texture.image = new ImageLoader().load('plitkarepeat.png')

                        const timesToRepeatHorizontally = 6
                        const timesToRepeatVertically = 6
                        texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

                        obj.children.forEach((child) => {
                            console.log(child)

                            if (child?.material?.name === "White") {
                                child.visible = false
                                // child.material.color = new Color(0.9,0.9,0.9)
                                // child.material.emissive = new Color(0.9,0.9,0.9)
                                // return
                            }

                            const geometry = new BoxGeometry(0.2,9.8,9.8)
                            const mesh = new Mesh(geometry, newMaterial)
                            mesh.receiveShadow = true
                            mesh.position.set(-4.28, 1, -0.8)
                            const mesh2 = mesh.clone()
                            mesh2.rotateY(MathUtils.degToRad(90))
                            mesh2.position.set(-1.5, 1, -4.3)
                            obj.add(mesh)
                            obj.add(mesh2)
                            child.material = newMaterial
                        })

                    }

                } else obj.visible = false

            })
            const gltf2 = await loader.loadAsync('400.glb')
            const gltfTop = await loader.loadAsync('800.glb')
            gltf2.scene.scale.set(2,2,2)
            gltf2.scene.position.set(-4, 0, 0 )

            gltfTop.scene.scale.set(2,2,2)
            gltfTop.scene.position.set(-4, 0,-1.21 )

            bottom1.scene.scale.set(2,2,2)
            bottom1.scene.position.set(-4, 0, 0 )

            bottom2.scene.scale.set(2,2,2)
            bottom2.scene.position.set(-4, 0,-1.21 )

            top1.scene.scale.set(2,2,2)
            top2.scene.scale.set(2,2,2)
            tabletop.scene.scale.set(2,2,2)

            top1.scene.position.set(-4.1, 3, 0 )
            top2.scene.position.set(-4.1, 3,-1.21 )

            tabletop.scene.position.set(-4.2, 1.63,-0.8)


            if (gltf) {
                console.log(shadowLight)
                scene.add(bottom1.scene);
                scene.add(bottom2.scene);
                scene.add(top1.scene);
                scene.add(top2.scene);
                scene.add(tabletop.scene);
                scene.add(gltf.scene);
                scene.add(shadowLight)
                // scene.add(spotLight)
            }
        }


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

    public getCamera(): PerspectiveCamera {
        const camera = new PerspectiveCamera(45);
        //this.configReactive.camera.position.y
        if (this.configReactive) camera.position.set(2.5, 3.3, 1.5);
        camera.lookAt(0, 2.8, 0);
        return camera
    }

    public async startRenderer(isPathTracing: boolean) {
        const scene = await this.getScene()
        const camera = this.getCamera();
        const renderer = this.getRenderer()

        function onResize() {
            // update rendering resolution
            const w = window.innerWidth;
            const h = window.innerHeight;

            renderer.setSize(w, h);
            renderer.setPixelRatio(window.devicePixelRatio);

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            if (isPathTracing) pathTracer.setScene(scene, camera);

        }

        document.body.appendChild(renderer.domElement);

        const settings = window.getScaledSettings();
        const pathTracer = isPathTracing ? new window.WebGLPathTracer(renderer) : renderer;
        if ("renderScale" in pathTracer && isPathTracing) {
            pathTracer.renderScale = settings.renderScale;
        }

        if (isPathTracing) {
            pathTracer.tiles.setScalar(settings.tiles);
            pathTracer.setScene(scene, camera);
        }

        onResize();

        animate();

        window.addEventListener('resize', onResize);

        function animate() {
            // if the camera position changes call "ptRenderer.reset()"
            requestAnimationFrame(animate);
            // update the camera and render one sample
            if (isPathTracing) pathTracer.renderSample();
            else pathTracer.render(scene, camera)
        }
    }
}
