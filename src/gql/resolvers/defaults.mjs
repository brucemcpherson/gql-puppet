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
  screenshotOptions: {
    captureBeyondViewport: false,
    encoding: "base64",
    clip: {
      scale: 1
    },
    fromSurface: false,
    fullPage: false,
    omitBackground: false
  },
};
