
// these fragments of code are compiled and tun in pupeteer context
const getElementsBody = `

  // get a nodelist of matches
  const nodeList = document.querySelectorAll(selector)

  // function to extract all attributes from a node
  const getAttributes = (item) => {
  
    const attribs = item.hasAttributes
      ? Array.from(item.attributes)
      : []
  
    return attribs.map(f => {
      const ob = {}
      ob[f.name] = f.value
      return ob
    })
  
  }

  // function to organize nodelist into an array of interesting items
  // the item property won't be serializable so wont be returned
  // but adding it here so it can be reused pupeteer side

  const getItems = (els) => {
    return Array.from(els)
      .map (item=> ({
        id: item.id,
        selector,
        attributes: getAttributes(item),
        name: item.nodeName,
        type: item.nodeType,
        text: item.innerText,
        value: item.nodeValue,
        item
      }))
  }
`
const getElements = `(selector) => {
    ${getElementsBody}
    return getItems (nodeList)
  }
`
// we can reuse most of the getelements fragment to get started here
const getTables = `(selector) => {
  ${getElementsBody}
  const elements =  getItems (nodeList)
  const tables = elements.map (element=> {
    const {item} = element
    const tr = Array.from(item.querySelectorAll ("tr"))

    const rows = tr.map (r=> 
      Array.from(r.querySelectorAll("td")).map(d=>d.innerText)
    ).filter(f=>f.length)

    const headers = tr.map (r=> 
      Array.from(r.querySelectorAll("th")).map(d=>d.innerText)
    ).filter(f=>f.length)

    const result = {
      headers,
      rows
    }
    return result
  })
  return tables
}
`

export const plugins = {
  getElements,
  getTables
}

