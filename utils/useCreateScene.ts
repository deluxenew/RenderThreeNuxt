import type {Page} from "puppeteer";
import type {BuildRequest} from "~/types/requestTypes";


export default async function (page: Page, buildRequest: BuildRequest): Promise<void> {
    await page.evaluate(async (config: BuildRequest): Promise<void> => {
            const BuilderApi = window.BuilderApi
            const builder = new BuilderApi(config)

            const scene = builder.getScene()
            const camera = builder.getCamera();
            const renderer = builder.getRenderer()

            document.body.appendChild(renderer.domElement);

            const settings = window.getScaledSettings();
            const pathTracer = new window.WebGLPathTracer(renderer);
            if ("renderScale" in pathTracer) {
                pathTracer.renderScale = settings.renderScale;
            }

            pathTracer.tiles.setScalar(settings.tiles);
            pathTracer.setScene(scene, camera);

            onResize();

            animate();

            window.addEventListener('resize', onResize);

            function animate() {
                // if the camera position changes call "ptRenderer.reset()"
                requestAnimationFrame(animate);
                // update the camera and render one sample
                pathTracer.renderSample();
            }

            function onResize() {
                // update rendering resolution
                const w = window.innerWidth;
                const h = window.innerHeight;

                renderer.setSize(w, h);
                renderer.setPixelRatio(window.devicePixelRatio);

                camera.aspect = w / h;
                camera.updateProjectionMatrix();

                pathTracer.setScene(scene, camera);

            }

        },
        buildRequest
    );
}
