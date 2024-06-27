import got from "got";
const test = async () => {
  const url = "https://mcpher.com";
  const app = "http://localhost:8089/graphql";
  const payload = {
    variables: {
      url,
    },
    query: `
      query ($url: URL!) {
        screenshot(url: $url) {
          page {
            url {
              href
            }
          }
          mimeType
          base64Bytes
          viewport {
            deviceScaleFactor
            height
            width
            hasTouch
            isMobile
            isLandscape
          }
        }
      }
    `,
  };
  try {
    const result = await got
      .post(app, {
        json: payload,
      })
      .json();

    console.log(result.data);
  } catch (err) {
    console.log(err);
  }
};
test();
