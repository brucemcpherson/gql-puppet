export const typeMutation = `
  type Mutation {
    generateApiKey(email: EmailAddress!): ApiKey @auth(requires: [keyissuer,user])
  }
`;

