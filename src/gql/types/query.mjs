export const typeQuery = `
  type Query {
    page(url: URL!): Page @auth(requires: [user])
    usage: Usage  @auth(requires: [user])
    peekUsage(apiKey: String!): Usage  @auth(requires: [keyissuer,user])
  }
`;
