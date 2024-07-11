export const authDirective = `

  directive @auth(
    requires: [Role],
  ) on OBJECT | FIELD_DEFINITION

  enum Role {
    keyissuer,
    user
  }


`