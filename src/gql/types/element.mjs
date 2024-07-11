export const typeElement = `
  type Element {
    id: String
    name: String
    type: String
    text: String
    value: String
    attributes: JSON
  }
  type Elements {
    selector: Value
    count: Int
    elements: [Element]
  }
`