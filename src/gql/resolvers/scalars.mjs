

  import { GraphQLScalarType } from 'graphql'
  import { throwGql } from '../errors/handle.mjs';
  
  /**
   * check the scalar Value
   */
  const validateWhereValue = value => {
    if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number") return value;
    console.log ('failed to validatehwerevalue', value)
    throwGql (`Query error: not a valid value`);
  };


  export const customScalars = {
    // used to pass variable types as argument to queries
    Value: new GraphQLScalarType({
      name: 'Value',
      description: 'To pass multiple types to a select query',
      parseValue(value) {
        return validateWhereValue(value);
      },
      parseLiteral(ast) {
        return validateWhereValue(ast.value);
      },
      serialize(value) {
        // value comes from resolvers
        return value; // sent to the client
      },
    })
  };
  
