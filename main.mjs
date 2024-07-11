import { init } from "./src/mercserver.mjs";

// start the server
(async () => {
  const app = await init();
})();
