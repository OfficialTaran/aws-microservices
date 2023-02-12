import { Statement } from '/opt/nodejs/dynamoDB.mjs'
import { PromiseHandler } from '/opt/nodejs/Utils.mjs'

export async function rootHandler(event) {
  const response = (event.pathParameters && ('id' in event.pathParameters)) ?
    Statement(`SELECT name, id, in_stock, nominal_dimensions FROM products WHERE id='${event.pathParameters.id}'`).then(data => data[0]) :
    Statement('SELECT name, id, in_stock FROM products WHERE in_stock > 0')

  return await PromiseHandler(response)
}
