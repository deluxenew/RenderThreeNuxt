import puppeteer from "puppeteer";
import {H3Event} from "h3";
export default defineEventHandler(async () => {

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage();
    await page.setViewport({width: 2048, height: 1024, deviceScaleFactor: 1});
    await page.goto("http://localhost:3000/render");
    await new Promise((r) => setTimeout(r, 100000))
    // page.evaluate("document.getElementsByTagName('canvas')[0].style.zIndex=500");
    // page.evaluate("document.getElementsByTagName('canvas')[0].style.width='2048'");
    // // page.evaluate("document.getElementsByTagName('canvas')[0].style.height='900'");
    // page.evaluate("document.getElementsByTagName('canvas')[0].style.position='absolute'");
    // page.evaluate("BABYLON.Engine.LastCreatedScene.activeCamera.alpha = 1.4;");

    // await new Promise((r) => setTimeout(r, 4000))
    let contents = await page.screenshot({ encoding: 'base64' });
    await page.close()
    await browser.close()
// console.log(event.node.req)

    return contents
})
