import { Statement, InsertItem } from '/opt/nodejs/dynamoDB.mjs'
import { validateObject } from '/opt/nodejs/ObjectValidation/index.mjs'
import { PromiseHandler } from '/opt/nodejs/Utils.mjs'

export async function rootHandler(event) {
  const body = JSON.parse(event.body || '{}')
  const id = (event.pathParameters && ('id' in event.pathParameters)) ?
    event.pathParameters.id : null

  return await handlers[event.httpMethod]({id, body})
}

const handlers = {
  GET : async ({ id = null }) => {
    const response = id ?
      Statement(`SELECT * FROM products WHERE id='${id}'`).then(data => data[0]) :
      Statement('SELECT name, id FROM products')
  
    return await PromiseHandler(response)
  },
  POST: async ({ body = null }) => {

    const validation_data = validateObject({
      schema: 'products',
      object: body
    })

    if ( validation_data.length > 0 ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: validation_data })
      }
    }
    
    return await PromiseHandler(InsertItem({
      TableName: 'products',
      data: body
    }))
  },
  PUT: async ({ id = null, body = null }) => {

    const validation_data = validateObject({
      schema: 'products',
      object: body
    })

    if ( validation_data.length > 0 ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: validation_data })
      }
    }

    return await PromiseHandler(
      Statement('UPDATE products SET name=? SET unit_quantity=? ' 
        + 'SET nominal_dimensions.thickness=? SET nominal_dimensions.width=? '
        + 'SET nominal_dimensions.length=? SET in_stock=?'
        + 'WHERE id=?',
        [
          body.name,
          body.unit_quantity,
          body.nominal_dimensions.thickness,
          body.nominal_dimensions.width,
          body.nominal_dimensions.length,
          body.in_stock,
          id
        ])
    )
  }
}
