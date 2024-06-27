import {methods} from "./resolvers/methods.mjs"
import {scalars} from "./resolvers/scalars.mjs"
export const resolvers = {
  ...scalars,
  ...methods
}