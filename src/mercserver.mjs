"use strict";

import fastify from "fastify";
import mercurius from "mercurius";

import { resolvers } from "./gql/resolverdefs.mjs";
import { settings } from "./settings.mjs";
import { typeDefs } from "./gql/typedefs.mjs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { NoSchemaIntrospectionCustomRule } from "graphql";

export const init = async ({
  graphiql = true,
  logger = true,
  introspection = true,
} = {}) => {
  const app = fastify({ logger });

  // register mercurius plugins
  app.register(mercurius, {
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    resolvers,
    graphiql,
    validationRules: !introspection && [NoSchemaIntrospectionCustomRule],
  });

  // limit based on apikey
  // cant use ip address as apps script is pooled
  app.register(import("@fastify/rate-limit"), settings.rateLimit);

  // wait till gql is ready
  await app.ready();

  // start the server
  app.listen({
    port: settings.server.port,
  });

  return app;
};
