import {typeQuery} from "./types/query.mjs"
import {typePage} from "./types/page.mjs"
import {typeViewport} from "./types/viewport.mjs"
import {typeScreenshot} from "./types/screenshot.mjs"
import {typeUrl} from "./types/url.mjs"
import {typePdf} from "./types/pdf.mjs"
import {typeMutation} from "./types/mutation.mjs"
import {typeApiKey} from "./types/apikey.mjs"
import {typeTable} from "./types/table.mjs"
import {typeElement} from "./types/element.mjs"
import {typeEval} from "./types/eval.mjs"
import {authDirective} from "./types/directives.mjs"
import {typeUsage} from "./types/usage.mjs"

export const typeDefs = `
  scalar JSON
  scalar URL
  scalar EmailAddress
  scalar Timestamp
  scalar Value
  ${authDirective}
  ${typeQuery}
  ${typePage}
  ${typeViewport}
  ${typeScreenshot}
  ${typeUrl}
  ${typePdf}
  ${typeMutation}
  ${typeApiKey}
  ${typeTable}
  ${typeElement}
  ${typeEval}
  ${typeUsage}
`
