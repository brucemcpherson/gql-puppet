import got from "got";
import {promises as fs } from 'fs';

(async ()=> {

  // your cloud run endpoint
  const endpoint="https://gql-puppet-xxxxrun.app"
  const app = `${endpoint}/graphql`

  // your apikey as a regular user
  const apiKey = "xxxxxxxxx"
  const headers = {
    "x-gql-puppet-api-key": apiKey
  }

  // the graphql and payload
  const url = "https://cloud.google.com/"
  const pdfName = "gcp-docs.pdf"
  const payload = {
    variables: {
      url
    },
    query: `
      query ($url: URL!) {
        page (url: $url) {
          pdf {
            base64Bytes
          }
        }
      }
    `
  }
  // do the query
  const result = await got
  .post(app, {
    json: payload,
    headers
  })
  .json();

  // write the pdf file 

  await fs.writeFile(
    pdfName,
    result.data.page.pdf.base64Bytes, 
    {encoding: "base64"} 
  ).then (()=> {
    console.log ('...wrote', pdfName)
  })

}) ()
