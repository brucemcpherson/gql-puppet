"use strict";

import fastify from "fastify";
import mercurius from "mercurius";
import pkg from 'mercurius-auth'
const { mercuriusAuth } = pkg
import { resolvers } from "./gql/resolverdefs.mjs";
import { settings } from "./settings.mjs";
import { typeDefs } from "./gql/typedefs.mjs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { NoSchemaIntrospectionCustomRule } from "graphql";
import { getCacher } from "./caching/redis.mjs";
import * as fastifyRateLimit from "@fastify/rate-limit";
import { closeBrowser } from "./gql/resolvers/methods.mjs";

export const init = async ({
  graphiql = true,
  logger = true,
  introspection = true,
} = {}) => {
  const app = fastify({ logger });

  // limit based on apikey
  // cant use ip address as apps script is pooled
  const cacher = await getCacher();

  // use this to check api keys

  app.register(fastifyRateLimit, {
    ...settings.rateLimit,
    redis: cacher.client,
    keyGenerator: (request) => {
      return request.headers[settings.headers.apiKey]
    },
    max: (request, key) => {
      return settings.server.rateMaxes.apiKey
    },
  });



  // we can use this to access global state stuff
  const context = async (request) => {
    const apiKey = request.headers[settings.headers.apiKey]
    const roleKey = request.headers[settings.headers.roleKey]
    // check we know it
    const history = await cacher.getKeyReg(apiKey)
    return {
      cacher,
      isGoodKey: Boolean(history),
      apiKey,
      roleKey
    }
  }

  // register mercurius plugins
  app.register(mercurius, {
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    resolvers,
    context,
    graphiql,
    validationRules: !introspection && [NoSchemaIntrospectionCustomRule],
  });


  app.register(mercuriusAuth, {
    authContext(context) {
      const { isGoodKey, roleKey } = context
      return {
        roles: ["user", "keyissuer"].filter(f => {
          return (f === 'user' && isGoodKey) ||
            (f === 'keyissuer' && settings.keyIssuers.find(g => g === roleKey))
        })
      }
    },

    async applyPolicy(policy, parent, args, context, info) {

      // these are roles required to do whatever this is

      const { roles } = context.auth
      const requires = policy.arguments[0].value.values.map((r) =>
        r.value.toLowerCase()
      )

      // tbd - we'll want to have all of them or some of them?
      // im going for all
      return requires.every(f => roles.find(g => g === f))

    },
    authDirective: 'auth'
  })

  // health check route
  app.get("/", (_, reply) => {
    reply.send({ message: "post to /graphql or /graphiql endpoints" });
  });


  // wait till gql is ready
  await app.ready();

  // this will close the browser to avoid memory leaks
  await app.graphql.addHook('onResolution', async () => {
    await closeBrowser()
  })
  // start the server
  app.listen({
    port: settings.server.port,
    host: settings.server.host
  });




  return app;
};
