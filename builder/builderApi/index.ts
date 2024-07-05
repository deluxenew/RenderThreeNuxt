import * as THREE from 'three'
import {
    ACESFilmicToneMapping,
    BoxGeometry,
    BufferGeometry,
    Color,
    CubeReflectionMapping,
    CubeTextureLoader,
    DirectionalLight,
    ImageLoader,
    MathUtils,
    Mesh,
    MeshLambertMaterial,
    MeshStandardMaterial,
    NearestFilter,
    Object3D,
    PerspectiveCamera,
    RepeatWrapping,
    Scene,
    Vector2,
    WebGLRenderer
} from 'three'
import type {BuilderServer} from "./types";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {BuildRequest} from "~/types/requestTypes"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import getBoxBufferGeometry from "~/builder/builderApi/models/getBoxBufferGeometry";


interface InnerObject extends Object3D {
    geometry?: BufferGeometry
    material?: MeshStandardMaterial | MeshLambertMaterial
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
        const fbxLoader = new FBXLoader()
        fbxLoader.load(
            'fbx/SCENE.fbx',
            (object) => {
                object.traverse(function (child) {
                    if ((child as THREE.Mesh).isMesh) {
                        // (child as THREE.Mesh).material = material
                        if ((child as THREE.Mesh).material) {
                            ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
                        }
                    }
                })
                object.scale.set(.001, .001, .001)
                console.log(object)
                scene.add(object)
                console.log(scene)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
        const loader = new GLTFLoader()

        const gltf = await loader.loadAsync('room.glb')
        const bottom1 = await loader.loadAsync('400.glb')

        const bottom2 = await loader.loadAsync('800.glb')
        const top1 = await loader.loadAsync('400u.glb')
        const top2 = await loader.loadAsync('800u.glb')
        const tabletop = await loader.loadAsync('tabletop.glb')
        const shadowLight = new THREE.AmbientLight(0xffffff, 1.7)
        const shadowLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
        // shadowLight.rotation.set(-Math.PI /2,0,0)
        shadowLight2.position.set(7,4,0)
        shadowLight.position.set(2,3,0)
        // shadowLightr.position.set(1,3,0)

        shadowLight.castShadow = true



        shadowLight2.shadow.camera.left = -50
        shadowLight2.shadow.camera.right = 50
        shadowLight2.shadow.camera.top = 50
        shadowLight2.shadow.camera.bottom = -50
        // shadowLight2.shadow.camera.near = 1
        shadowLight2.shadow.radius = 5
        shadowLight2.shadow.bias = -0.0001
        shadowLight2.shadow.camera.far = 1000
        shadowLight2.shadow.mapSize.width = 50 // default is 512
        shadowLight2.shadow.mapSize.height = 50 // default is 512

        // const shadowLight2 = shadowLight.clone()
        // shadowLight2.position.set(3,2,0)


        // const spotLight = new PointLight(0xffffff, 0.5)
        // spotLight.name = 'Spot Light'
        // // spotLight.angle = Math.PI / 2
        // // spotLight.penumbra = 0.3
        // spotLight.position.set(0, 5 , 0)

        if (gltf) {

            // gltf.scene.scale.set(0.5, 0.5, 0.5)
            gltf.scene.children.forEach((obj: InnerObject) => {


                if ([
                    'Room',
                    'Windows',
                    'Windows_Frames',

                ].includes(obj.name)) {
                    if ( obj.name === 'Windows_Frames' && obj.material) {
                        // obj.position.z -= 0.12
                    }
                    if ( obj.name === 'Windows' && obj.material) {
                        obj.position.z += 0.095


                        obj.material.color = new Color(0,0,0)
                        // obj.material.emissive = new Color(0.4,0.4,0.4)

                        const newMesh = getBoxBufferGeometry()
                        gltf.scene.add(newMesh)
                    }

                    if (obj.name === 'Room') {
                        // obj.position.y = -1
                        const loader = new CubeTextureLoader()



                        obj.children.forEach((child) => {

                            if (child?.name === "Plane_2") {
                                const urls = []
                                for (let i = 0; i < 6; i++) {
                                    urls.push('plitkarepeat.jpg')
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



                                const timesToRepeatHorizontally = 4
                                const timesToRepeatVertically = 4
                                texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

                                child.visible = false
                                texture.image = new ImageLoader().load('plitkarepeat.jpg')
                                const geometry = new BoxGeometry(0.2,9.8,9.8)
                                const mesh = new Mesh(geometry, newMaterial)
                                mesh.receiveShadow = true
                                mesh.position.set(-4.2, 1, -0.8)
                                const mesh2 = mesh.clone()
                                mesh2.rotateY(MathUtils.degToRad(90))
                                mesh2.position.set(-1, 1, -4.2)

                                const mesh3 = mesh.clone()
                                mesh3.rotateY(MathUtils.degToRad(180))
                                mesh3.position.set(4.2, 1, -0.8)

                                const mesh4 = mesh.clone()
                                mesh4.rotateY(MathUtils.degToRad(-90))
                                mesh4.position.set(-1, 1, 4.2)

                                obj.add(mesh)
                                obj.add(mesh2)
                                obj.add(mesh3)
                                obj.add(mesh4)
                                child.material = newMaterial
                            } else {
                                const urlsfloor = []
                                for (let i = 0; i < 6; i++) {
                                    urlsfloor.push('plitkarepeat.png')
                                }
                                const texturefloor = loader.load(urlsfloor)
                                const newMaterialfloor = new MeshStandardMaterial({
                                    map: texturefloor
                                })

                                texturefloor.wrapS = RepeatWrapping
                                texturefloor.wrapT = RepeatWrapping
                                texturefloor.magFilter = NearestFilter
                                texturefloor.mapping = CubeReflectionMapping
                                texturefloor.offset = new Vector2(2,2)



                                const timesToRepeatHorizontally = 4
                                const timesToRepeatVertically = 4
                                texturefloor.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

                                texturefloor.image = new ImageLoader().load('plitkarepeat.png')
                                child.material = newMaterialfloor

                                const cloneFloor = child.clone()
                                cloneFloor.position.set(0, 5.5,0)
                                cloneFloor.rotateX(MathUtils.degToRad(180))
                                obj.add(cloneFloor)

                            }

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

            tabletop.scene.position.set(-4.15, 1.62,-0.81)
            // shadowLight.target = tabletop.scene
            // shadowLight2.target = tabletop.scene

            if (bottom1) {
                [bottom1.scene, bottom2.scene,top1.scene, top2.scene].forEach((scene) => {
                    scene.children[0].children.forEach((el: InnerObject) => {

                        if (!el.name.includes("Facade")) return

                        const texture = 'plitkarepeat1.png'

                        const urls = []
                        for (let i = 0; i < 6; i++) {
                            urls.push(texture)
                        }
                        const refractionCube = new THREE.CubeTextureLoader().load( urls );
                        refractionCube.mapping = THREE.CubeRefractionMapping;
                        // refractionCube.wrapS = RepeatWrapping
                        // refractionCube.wrapT = RepeatWrapping
                        //
                        // const timesToRepeatHorizontally = 4
                        // const timesToRepeatVertically = 4
                        // refractionCube.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

                        el.material =  new THREE.MeshLambertMaterial({
                            color: 0x222222,
                            refractionRatio: 2,
                            envMap: refractionCube,
                            // combine: THREE.MixOperation,
                            reflectivity: 0.2

                        })


                        // el.material = getReflectionMaterial()
                        el.material.needsUpdate = true
                    })
                })

            }


            if (gltf) {
                // scene.add(bottom1.scene);
                // scene.add(bottom2.scene);
                // scene.add(top1.scene);
                // scene.add(top2.scene);
                // scene.add(tabletop.scene);
                // scene.add(gltf.scene);
                // // scene.add(shadowLightr)
                scene.add(shadowLight)
                scene.add(shadowLight2)
                // scene.add(spotLight)
            }
        }


        const texture = new window.GradientEquirectTexture();
        if ("bottomColor" in texture && 'topColor' in texture) {
            texture.topColor.set(0xffffff);
            texture.bottomColor.set(0xffffff);
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
        if (this.configReactive) camera.position.set(30.5, 15.3, 32.5);
        camera.lookAt(0, 0, 0);
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
