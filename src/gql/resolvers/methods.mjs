import { defaults } from "./defaults.mjs";
import { digest } from "../../utils.mjs"
import { plugins } from "../../plugins/prebaked.mjs";

import puppeteer from "puppeteer";

let _browser = null;

// get a headless browser
const getBrowser = async (options) => {
  _browser = _browser ? Promise.resolve(_browser) : puppeteer.launch(options);
  return _browser;
};

const getDataUri = (parent) => {
  if (!parent) return null;
  const { base64Bytes, mimeType } = parent;
  return `data:${mimeType};base64,${base64Bytes}`;
};

// navigate to required href
const gotoPage = async ({ url, logConsole }) => {
  const browser = await getBrowser();
  const page = await browser.newPage();

  // this can be used to direct pupeteer side console.log messages
  // to the local console and is for local debugging
  if (logConsole) {
    page.on('console', msg => {
      msg.args().forEach (m=> console.log(`${i}: ${m}`))
    });
  }
  return page.goto(url.href, { 
    waitUntil: 'networkidle0' }
  ).then(() => page);
};

const setPage = async ({ page, viewport }) => {
  viewport = {
    ...defaults.viewport,
    ...viewport,
  };
  await page.setViewport(viewport);
  return {
    page,
    viewport,
  };
};

const getUsage =  ({cacher, apiKey}) => {
  return cacher.getUsage ({apiKey})
}

// increment usage
const incMethod = ({ context, method }) => {
  const { apiKey, spoof, cacher } = context
  return cacher.incMethod({ apiKey: apiKey || spoof, method })
}

// general purpose running stuff with page.evaluate
// code is a string of javascript code to be executed
// ...args are any args expected to be passed to it
const execPlugin = async ({ page, code }, ...args) => {

  return page.evaluate((code, ...args) => {
    console.log(code)
    const compilePlugin = (code) => {
      return new Function(`return (${code})`)()
    }

    // compile and run the code pupeteer side
    return compilePlugin(code)(...args)

  }, code, ...args)

}


// resolver methods
export const methods = {
  Mutation: {
    async generateApiKey(_, { email }, context) {
      const apiKey = digest(email)
      const { cacher } = context
      cacher.storeApiKey({ apiKey, email })
      return {
        email,
        apiKey
      }
    }
  },
  Query: {

    // get info about current user usage
    async usage (_,p, context) {
      const {apiKey, cacher} = context
      return cacher.getUsage ({apiKey})
    },

    // admin access to others usage
    async peekUsage (_,{apiKey}, context) {
      const { cacher} = context
      return cacher.getUsage ({apiKey})
    },

    // get info about the required page
    async page(_, { url }, context) {
      // set true for desperate local debugging of eval plugins
      const logConsole = false
      const p = await gotoPage({ url, logConsole });

      // register the method usage
      incMethod({ context, method: 'page' })

      return {
        url,
        _page: p,
      };
    },
  },
  Screenshot: {
    dataUri(parent, _, context) {
      // register the method usage
      incMethod({ context, method: 'dataUri' })
      return getDataUri(parent);
    },
  },

  Page: {

    // do a custom eval
    async eval(parent, { code, arg }, context) {
      const { _page: page } = parent
      incMethod({ context, method: 'eval' })

      // it'll be compiled and will run in puppeteer context
      const result = await execPlugin({
        page,
        code
      }, arg)

      return {
        code,
        arg,
        result
      }

    },

    // extract tables matching the selector
    async tables(parent, { selector }, context) {
      const { _page: page } = parent
      incMethod({ context, method: 'tables' })

      // it'll be compiled and will run in puppeteer context
      const tables = await execPlugin({
        page,
        code: plugins.getTables
      }, selector)

      return {
        selector,
        count: tables?.length,
        tables
      }

    },
    async elements(parent, { selector }, context) {
      const { _page: page } = parent

      incMethod({ context, method: 'elements' })

      // this is a prebaked plugin
      // it'll be compiled and will run in puppeteer context
      const elements = await execPlugin({
        page,
        code: plugins.getElements
      }, selector)


      return {
        selector,
        count: elements?.length,
        elements
      }
    },

    // take a screenshot
    async screenshot(parent, { viewport = {}, options }, context) {
      // go to the page and set the viewport
      const { _page: page } = parent
      const { viewport: vp } = await setPage({ page, viewport });

      // make the options for the screenshot
      // only support base64 encoding

      options = {
        ...defaults.screenshotOptions,
        ...options,
        // only supporting this
        encoding: defaults.screenshotOptions.encoding,
      };

      const base64Bytes = await page.screenshot(options);
      incMethod({ context, method: 'screenshot' })
      return {
        options,
        viewport: vp,
        base64Bytes,
        mimeType: `image/${options.type}`,
      };
    },

    // convert to pdf
    async pdf(parent, { viewport = {}, options }, context) {
      // go to the page and set the viewport
      const { _page: page } = parent
      const { viewport: vp } = await setPage({ viewport, page });

      // make the options for the pdf
      options = {
        ...defaults.pdfOptions,
        ...options,
      };

      // convert the buffer to base64
      const p = await page.pdf(options);
      const base64Bytes = p.toString("base64");
      incMethod({ context, method: 'pdf' })
      return {
        options,
        viewport: vp,
        base64Bytes,
        mimeType: "application/pdf",
      };
    },
  },
};
