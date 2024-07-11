export const defaults = {
  viewport: {
    deviceScaleFactor: 1,
    height: 0,
    width: 0,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
    optimizeForSpeed: false,
    quality: 100,
    type: "png"
  },
  pdfOptions: {
    displayHeaderFooter: false,
    paperFormat: "A4",
    landscape: false,
    omitBackground: false,
    outline: false,
    preferCSSPageSize: false,
    printBackground: true,
    scale: 1.0,
    tagged: true,
    timeout: 30000,
    emulateMediaType: "print"
  },
  screenshotOptions: {
    captureBeyondViewport: false,
    encoding: "base64",
    fromSurface: false,
    fullPage: false,
    omitBackground: false,
    type: "png"
  },
};
