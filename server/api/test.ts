import puppeteer, {Browser, Page} from "puppeteer";
import {H3Event} from "h3";
import type {BuildRequest} from "~/types/requestTypes";
export default defineEventHandler(async (event: H3Event): Promise<string> => {


    const body = await readBody(event)
    const browser: Browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page: Page = await browser.newPage();

    try {
        await page.setViewport({width: 800, height: 600, deviceScaleFactor: 1});
        await page.goto("http://localhost:3000/render");
        await new Promise((r) => setTimeout(r, 4000))
        await page.evaluate(async (config: BuildRequest): Promise<void> => {
                const builder = new window.BuilderApi(config)
                builder.startRenderer(true)
            },
            body
        );


        await new Promise((r) => setTimeout(r, 800000))

        let contents = await page.screenshot({encoding: 'base64'});
        await page.close()
        await browser.close()
        return contents
    } catch (e) {
        await page.close()
        await browser.close()
        return ''
    }
})
