import puppeteer, {Browser, Page} from "puppeteer";
import {H3Event} from "h3";
import SceneBuilder from "~/libs/builder";

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
        await page.goto("http://localhost:3001");
        await new Promise((r) => setTimeout(r, 3000))

        await page.evaluate(async () => {
            // window.addEventListener('DOMContentLoaded', function () {
            const THREE = window.THREE
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            camera.position.z = 5;


            function animate() {
                requestAnimationFrame(animate);
                cube.rotation.x += 0.02;
                cube.rotation.y += 0.02;
                renderer.render(scene, camera);
            }

            animate();
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
