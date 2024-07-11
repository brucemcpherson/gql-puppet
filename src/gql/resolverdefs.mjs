import {methods} from "./resolvers/methods.mjs"
import { 
  URLResolver, 
  JSONResolver, 
  EmailAddressResolver,
  TimestampResolver
 } from 'graphql-scalars';
import { customScalars}  from "./resolvers/scalars.mjs"

export const resolvers = {
  URL: URLResolver,
  JSON:JSONResolver,
  Timestamp: TimestampResolver,
  EmailAddress:EmailAddressResolver,
  ...customScalars,
  ...methods
}