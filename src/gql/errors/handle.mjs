import { GraphQLError } from 'graphql'
export const throwGql = (...args) => {
  throw new GraphQLError(...args)
}