import puppeteer, {Browser, Page} from "puppeteer";
import {H3Event} from "h3";
// import SceneBuilder from "~/libs/builder";
// import * as THREE from "three";
// import {GradientEquirectTexture, WebGLPathTracer} from "~/renderer/index.module";
// import {getScaledSettings} from "~/renderer/getScaledSettings";

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody(event)
    console.log(body)

    const browser: Browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })


    const page: Page = await browser.newPage();

    try {
        // const eventStream = createEventStream(event)

        await page.setViewport({width: 2048, height: 1024, deviceScaleFactor: 1});
        await page.goto("http://localhost:3001/render");
        await new Promise((r) => setTimeout(r, 3000))

        await page.evaluate(async () => {
            const { Scene,
                SphereGeometry,
                MeshStandardMaterial,
                Mesh,
                BoxGeometry,
                PerspectiveCamera,
                ACESFilmicToneMapping,
                WebGLRenderer,
                SpotLight }  = window.THREE
            // window.sceneBuilder = new SceneBuilder(null)
            // console.log(window?.sceneBuilder)
            const scene = new Scene();
            const sphereGeom = new SphereGeometry( 0.49, 64, 32 );
            const ball1 = new Mesh(
                sphereGeom,
                new MeshStandardMaterial( {
                    color: '#e91e63',
                    roughness: 0.25,
                    metalness: 1,
                } )
            );
            const ball2 = new Mesh(
                sphereGeom,
                new MeshStandardMaterial( {
                    color: '#ff9800',
                    roughness: 0.1,
                    metalness: 1,
                } )
            );
            ball2.castShadow = true

            const material = new MeshStandardMaterial( {
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
                new BoxGeometry( 3.5, 0.1, 1.5 ),
                new MeshStandardMaterial(),
            );
            ground.receiveShadow = true
            const newLight = new SpotLight( 0x2196f3, 2 );

            ball1.position.x = - 1;
            ball3.position.x = 1;
            ground.position.y = - 0.54;
            scene.add( ball1, ball2, ball3, ground, newLight );


// set the environment map
            const texture = new window.GradientEquirectTexture();
            if ("bottomColor" in texture && 'topColor' in texture) {
                texture.topColor.set( 0xffffff );
                texture.bottomColor.set( 0x666666 );
            }

            texture.update();
            scene.environment = texture;
            scene.background = texture;

            const camera = new PerspectiveCamera();
            camera.position.set( 0, 2, - 5 );
            camera.lookAt( 0, 0, 0 );

            const renderer = new WebGLRenderer( { antialias: true } );
            renderer.toneMapping = ACESFilmicToneMapping;
            document.body.appendChild( renderer.domElement );

            const settings = window.getScaledSettings();
            const pathTracer = new window.WebGLPathTracer( renderer );
            if ("renderScale" in pathTracer) {
                pathTracer.renderScale = settings.renderScale;
            }

            pathTracer.tiles.setScalar( settings.tiles );
            pathTracer.setScene( scene, camera );

            onResize();

            animate();

            window.addEventListener( 'resize', onResize );

            function animate() {

                // if the camera position changes call "ptRenderer.reset()"
                requestAnimationFrame( animate );

                // update the camera and render one sample
                pathTracer.renderSample();

            }

            function onResize() {

                // update rendering resolution
                const w = window.innerWidth;
                const h = window.innerHeight;

                renderer.setSize( w, h );
                renderer.setPixelRatio( window.devicePixelRatio );

                camera.aspect = w / h;
                camera.updateProjectionMatrix();

                pathTracer.setScene( scene, camera );

            }
        //     // window.addEventListener('DOMContentLoaded', function () {
        //     const THREE = window.THREE
        //     const scene = new THREE.Scene();
        //     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //     const renderer = new THREE.WebGLRenderer();
        //     renderer.setSize(window.innerWidth, window.innerHeight);
        //     document.body.appendChild(renderer.domElement);
        //     const geometry = new THREE.BoxGeometry(1, 1, 1);
        //     const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        //     const cube = new THREE.Mesh(geometry, material);
        //     scene.add(cube);
        //     camera.position.z = 5;
        //
        //
        //     function animate() {
        //         requestAnimationFrame(animate);
        //         cube.rotation.x += 0.02;
        //         cube.rotation.y += 0.02;
        //         renderer.render(scene, camera);
        //     }
        //
        //     animate();
        });

        let contents = await page.screenshot({encoding: 'base64'});
        await page.close()
        await browser.close()

        return contents
    } catch (e) {
        await page.close()
        await browser.close()
        return ''
    }


// console.log(event.node.req)


})
