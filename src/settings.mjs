export const settings = {

  // handle global values
  state: new Map(),

  // basic server settings
  server:{
    port: process.env.PORT || 8089,
    rateLimit: {
      max: 5,
      timeWindow: "1 minute"
    }
  },


  defaults: {
    viewport: {
      deviceScaleFactor: 1,
      height: 0,
      width: 0,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    },
  },
};
