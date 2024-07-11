export const typePage = `
  type Page {
    url: Url

    eval (
      code: String!
      arg: JSON
    ): Eval

    elements (
      selector: Value!
    ): Elements

    tables (
      selector: Value!
    ): Tables

    screenshot (
      viewport:ViewportInput, 
      options: ScreenshotOptionsInput 
    ): Screenshot

    pdf(
      viewport:ViewportInput, 
      options: PdfOptionsInput 
    ): Pdf
  }
`;
