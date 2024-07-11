import dotenv from "dotenv";
dotenv.config();

const configStr = process.env.CONFIG
const config = JSON.parse(configStr)
export const settings = {
  redis: {
    password: config.REDIS_PASSWORD,
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    enableAutoPipelining: true,
    connectionName: "gql-puppet",
    connectTimeout: 1500,
    maxRetriesPerRequest: 1
  },
  usage: {
    usagePrefix: "gql-puppet-usage"
  },
  checks: {
    redis: true
  },
  digest: {
    salt: config.DIGEST_SALT,
  },
  keyIssuers: [config.KEY_ISSUER],
  headers: {
    apiKey: "x-gql-puppet-api-key",
    roleKey: "x-gql-puppet-role-key"
  },

  // basic server settings
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "0.0.0.0",
    rateMaxes: {
      apiKey: 10,
    },
    rateLimit: {
      // applies to all routes
      global: true,
      // duration of time window
      timeWindow: 3000 * 60,
      nameSpace: "gql-puppet-rate-",
      ban: 3
    },
  }
};


