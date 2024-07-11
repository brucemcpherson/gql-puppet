const pdfMargin = `
  top: Float
  bottom: Float
  left: Float
  right: Float
`

const pdfOptions = `
  displayHeaderFooter: Boolean
  footerTemplate: String
  paperFormat: String
  headerTemplate: String
  landscape: Boolean
  omitBackground: Boolean
  outline: Boolean
  pageRanges: String
  path: String
  preferCSSPageSize: Boolean
  printBackground: Boolean
  scale: Float
  tagged: Boolean
  timeout: Int
  width: String
  emulateMediaType: EmulateMediaType
` 
export const typePdf = `

  enum EmulateMediaType {
    screen
    print
  }

  type Pdf {
    page: Page
    viewport: Viewport
    mimeType: String
    base64Bytes: String
    options: PdfOptions
  }
  type PdfOptions {
    ${pdfOptions}
    pdfMargin: PdfMargin
  }
  input PdfOptionsInput {
    ${pdfOptions}
    pdfMargin: PdfMarginInput
  }
  type PdfMargin {
    ${pdfMargin}
  }
  input PdfMarginInput {
    ${pdfMargin}
  }
  
`