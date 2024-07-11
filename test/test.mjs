import got from "got";
import { settings } from "./private/secrets.mjs"

// cloud run
// const app = "https://gql-puppet.mcpher.dev";
// local
const app = "http://0.0.0.0:8080/graphql";

const url = "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population"

const rateLimitPayload = {
  variables: {
    url,
  },
  query: `    
    query ($url: URL!) {
      page (url: $url) {
        url { href }
      }
    }
  `
}

const screenshotPayload = {
  variables: {
    url,
  },
  query: `
    query ($url: URL!) {
      page (url: $url) {
        url { href }
        screenshot {
          mimeType
          base64Bytes
          dataUri
          viewport {
            deviceScaleFactor
            height
            width
            hasTouch
            isMobile
            isLandscape
          }
        }
      }
    }`,
};

const pdfPayload = {
  variables: {
    url,
  },
  query: `
    query ($url: URL!) {
      page (url: $url) {
        url { href }
        pdf {
          mimeType
          base64Bytes
          viewport {
            deviceScaleFactor
            height
            width
            hasTouch
            isMobile
            isLandscape
          }
        }
      }
    }`,
};

const elementsPayload = {
  variables: {
    selector: 'table',
    url
  },
  query: `
      query ($url: URL!, $selector: Value!)
    {
      page (url: $url) {
        elements (selector: $selector) {
          selector
          count
          elements {
            name
            type
            id
            attributes 
          }
        }
      }
    }
  `
};

const evalPayload = {
  variables: {
    code: `(selector) => {
        const elements = document.querySelectorAll (selector)
        return Array.from(elements)
          .map (element=>({
            id: element.id,
            src: element.src
          }))
        }
    `,
    arg: 'img',
    url
  },
  query: `
    query ($url: URL!, $arg: JSON, $code: String!) {
      page (url: $url) {
        eval (code: $code, arg: $arg) {
          arg
          code
          result
        }
      }
    }
  `
}

const tablesPayload = {
  variables: {
    url,
    "selector": "table"
  },
  query: `
    query ($url: URL!, $selector: Value!) {
      page(url: $url) {
        tables(selector: $selector) {
          selector
          count
          tables {
            headers 
            rows
          }
        }
      }
    }
  `
}

const testScreenshot = () => {
  test({ payload: screenshotPayload, prop: 'screenshot' })
}

const testRateLimit = async () => {
  const loop = Array.from({length: 10})
  await Promise.all (loop.map (l=>test({ payload: rateLimitPayload })
    .then(r=>console.log(r?.url?.href))))
}

const testElements = () => {
  test({ payload: elementsPayload, prop: 'elements' })
}

const testEval = async () => {
  const response = await test({ payload: evalPayload, prop: 'eval' })
  console.log(response.data.page.eval.result)
}

const testTables = () => {
  test({ payload: tablesPayload, prop: 'tables' })
}

const testPdf = () => {
  test({ payload: pdfPayload, prop: 'pdf' })
}

const test = async ({ payload, prop }) => {


  const headers = {}
  headers[settings.headers.apiKey] = settings.apiKey

  let result
  try {
    result = await got
    .post(app, {
      json: payload,
      headers
    })
    .json();
  } catch (err) {
    if (err.response.statusCode === 429) {
      console.log ('rate limit', err.response.statusCode)
      console.log ('rate limit', err.response.headers)
    }
    console.log (err.message)
    console.log(err.response.body)
  }

 
  if (!result?.data?.page) {
    console.log("no page data received:"); 
  }
  if (prop && !result?.data?.page?.[prop]) {
    console.log("no data received for prop:", prop); 
  }
  console.log(result?.data);
  return result

};

//testElements();
//testScreenshot();
//testPdf()
//testTables()
//testEval()
testRateLimit()
