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
        await page.goto("http://localhost:3000/render");

        await new Promise((r) => setTimeout(r, 4000))
        const b = await page.evaluateHandle(() => {
            if (typeof window !== "undefined") {
                window.sceneBuilder = new SceneBuilder({sceneConfig: {texture: '123123'}, roomConfig: {walls: []}})
            }

            return window.sceneBuilder

        })
        console.log(b)

        // const win = await page.evaluateHandle(() => window)
        // const interval = setInterval(async () => {
        //     await eventStream.push(`Message @ ${1}`)
        // }, 1000)
        //
        // eventStream.onClosed(async () => {
        //     clearInterval(interval)
        //     await eventStream.close()
        // })

        await new Promise((r) => setTimeout(r, 10000))

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
