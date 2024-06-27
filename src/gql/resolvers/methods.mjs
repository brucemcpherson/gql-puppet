import { defaults } from "./defaults.mjs";
import puppeteer from "puppeteer";

let _browser = null;

// get a headless browser
const getBrowser = async (options) => {
  _browser = Promise.resolve(_browser) || puppeteer.launch(options);
  return _browser;
};

// navigate to required href
const gotoPage = async ({ url }) => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  return page.goto(url.href).then(() => page);
};

// resolver methods
export const methods = {
  Query: {
    // get info about the required page
    async page(_, { url }) {
      const p = await gotoPage({ url });
      return {
        url,
      };
    },

    // take a screenshot
    async screenshot(_, { url, viewport = {}, options }) {
      // go to the page and set the viewport
      viewport = {
        ...defaults.viewport,
        ...viewport,
      };
      const page = await gotoPage({ url });
      await page.setViewport(viewport);

      // make the options for the screenshot
      // only support base64 encoding
      options = {
        ...defaults.screenshotOptions,
        ...options,
        encoding: defaults.screenshotOptions.encoding,
      };
      const base64Bytes = await page.screenshot(options);

      return {
        page: {
          url,
        },
        options,
        viewport,
        base64Bytes,
        mimeType: `image/${options.type}`,
      };
    },

  },
};
