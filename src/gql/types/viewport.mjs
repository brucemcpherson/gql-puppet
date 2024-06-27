const viewport = `
  deviceScaleFactor: Float 
  height: Int
  width: Int
  hasTouch: Boolean
  isLandscape: Boolean
  isMobile: Boolean
`

export const typeViewport = `
 type Viewport {
    ${viewport}
  }
  input ViewportInput {
    ${viewport}
  }
`