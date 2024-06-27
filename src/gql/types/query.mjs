export const typeQuery = `
  type Query {
    page(url: URL!): Page
    screenshot(url: URL!, viewport:ViewportInput, options: ScreenshotOptionsInput ): Screenshot
  }
`;
