// One off for creating a seed API key
import { settings } from "../src/settings.mjs";
import { getCacher } from "../src/caching/redis.mjs";
import { digest } from "../src/utils.mjs"

(async ()=> {
    // create admin access for you
    // but before running this
    // get the secret into your env by executin
    // . ./shells/get-secret.sh
    const email = "your email"

    const cacher = await getCacher();
    
    // make a key
    const apiKey = digest(email)
    
    // store the thing in redis
    await cacher.storeApiKey({ apiKey, email })
    console.log (`created apiKey ${apiKey} for ${email}`)
    process.exit(0)

})()