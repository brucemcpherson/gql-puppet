import {typeQuery} from "./types/query.mjs"
import {typePage} from "./types/page.mjs"
import {typeViewport} from "./types/viewport.mjs"
import {typeScreenshot} from "./types/screenshot.mjs"
import {typeUrl} from "./types/url.mjs"
export const typeDefs = `
  scalar URL
  ${typeQuery}
  ${typePage}
  ${typeViewport}
  ${typeScreenshot}
  ${typeUrl}
`