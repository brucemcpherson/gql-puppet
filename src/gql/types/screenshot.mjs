const screenshotClip = `
    scale: Float
`;


const screenshotOptions = `
  encoding: String
  captureBeyondViewport: Boolean
  fromSurface: Boolean
  fullPage: Boolean
  omitBackground: Boolean
  optimizeForSpeed: Boolean
  quality: Int
  type: String
`;
// todo encoding optionsENUM

const typeScreenshotOptions = `
    type ScreenshotOptions {
      ${screenshotOptions}
      clip: ScreenshotClip
    }
    type ScreenshotClip {
      ${screenshotClip}
    }
    input ScreenshotClipInput {
      ${screenshotClip}
    }
    input ScreenshotOptionsInput {
      ${screenshotOptions}
      clip: ScreenshotClipInput
    }
  `;

export const typeScreenshot = `
  
  ${typeScreenshotOptions}

  type Screenshot {
    page: Page
    mimeType: String
    base64Bytes: String
    viewport: Viewport
    fullScreen: Boolean
    options: ScreenshotOptions
  }
`;
