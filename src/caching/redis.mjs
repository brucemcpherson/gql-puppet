import { settings } from "../settings.mjs";
import Redis from "ioredis";
import { throwGql } from "../gql/errors/handle.mjs"

class RedisCacher {
  constructor({
    connectionName = settings.redis.connectionName,
    keyPrefix = settings.usage.usagePrefix
  } = {}) {
    this.client = new Redis({
      ...settings.redis,
      connectionName,
      keyPrefix
    });
    this.connectionName = connectionName
    this.keyPrefix = keyPrefix
    if (settings.checks.redis) {
      this.constructor.checkConnection(this)
    }
  }

  getKey(key) {
    return this.keyPrefix + '-' + key
  }

  hasApiKey(apiKey) {
    const key = this.getKey(apiKey)
    return this.client.exists(key)
  }

  async getKeyReg(apiKey) {
    const key = this.getKey(apiKey)
    // JSON path returns an array - we'll use legacy path (no $)
    const value = await this.client.call("JSON.GET", key)
    return value ? JSON.parse(value) : null
  }

  incKey(key, value = 1) {
    return this.client.call(
      "JSON.NUMINCRBY",
      key,
      "$.accesses",
      value
    )
  }

  incApiKey({ apiKey, value = 1 }) {
    const key = this.getKey(apiKey)
    return this.incKey(key, value)
  }

  // increase method count
  async incMethod({ apiKey, method }) {

    const key = this.getKey(apiKey)
    const path = ".methods"
    // note: a json path returns an array, use legacy instead
    const value = await this.client.call(
      "JSON.GET", key, path
    )
    const methods = JSON.parse(value)
    // if we haven't seen this one before, need to add
    if (!methods[method]) {
      methods[method] = {
        count: 0
      }
    }
    // do it by month also
    const month = new Date().getUTCMonth()
    const year = new Date().getUTCFullYear()
    const dateKey = 'ym'+(year*100 + month)
    if (!methods[method][dateKey]){
      methods[method][dateKey] = 0
    }
    methods[method][dateKey]++

    // just counting the number of times method is called
    methods[method].count++
    methods[method].modifiedAt = new Date().getTime()
    return this.client.call(
      "JSON.SET", key, path, JSON.stringify(methods)
    )
  }

  async getUsage ({apiKey}) {
    return this.getKeyReg(apiKey)
  }

  async storeApiKey({ apiKey, email }) {
    const keyReg = await this.getKeyReg(apiKey)
    const modifiedAt = new Date().getTime()

    if (keyReg) {
      if (email !== keyReg.email) {
        throwGql('ERROR: api key reg doesnt match email requested-' + email)
      }
      return {
        ...keyReg,
        alreadyExists: true,
        accesses: keyReg.accesses + 1,
        modifiedAt
      }
    }

    // create one
    const key = this.getKey(apiKey)
    return this.client.call(
      "JSON.SET",
      key,
      "$",
      JSON.stringify({
        apiKey,
        email,
        createdAt: modifiedAt,
        accesses: 1,
        modifiedAt,
        methods: {}
      }))
  }

  static checkConnection = ({ client, connectionName }) => {
    // check it works
    const key = new Date().getTime().toString();
    return client
      .set(key, key, "EX", 1)
      .then(() => client.get(key))
      .then((value) => {
        if (value !== key) {
          throwGql`validation failure on redis ${connectionName} - expected ${key} got ${value}`;
        } else {
          console.log(
            `...connection test to redis ${connectionName} successful`
          );
        }
        return client;
      });
  };


}

export const getCacher = (...args) => new RedisCacher(...args)



