import { Statement } from '/opt/nodejs/dynamoDB.mjs'
import { validateObject } from '/opt/nodejs/ObjectValidation/index.mjs'
import { acceptable_states } from '/opt/nodejs/ObjectValidation/Schemas/orders.mjs'
import { PromiseHandler } from '/opt/nodejs/Utils.mjs'

export async function rootHandler(event) {
  const body = JSON.parse(event.body || '{}')
  const id = (event.pathParameters && ('id' in event.pathParameters)) ?
    event.pathParameters.id : null

  return await handlers[event.httpMethod]({id, body, params: event.queryStringParameters})
}

const handlers = {
  GET : async ({ id = null, params = null }) => {
    console.log(params)

    let list_statement = 'SELECT customer, id, staging_location FROM orders'
    if (params && params.state) {
      // make sure it's a valid state
      if (! acceptable_states.includes(params.state)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `query parameter state = ${params.state} not recognized` })
        }
      }
      // otherwise, add it as a condition
      list_statement = list_statement + ` WHERE state='${params.state}'`
    }

    const response = id ?
      Statement(`SELECT * FROM orders WHERE id='${id}'`).then(data => data[0]) :
      Statement(list_statement)
  
    return await PromiseHandler(response)
  },
  PATCH: async ({ id = null, body = null }) => {
    const validation_data = validateObject({
      schema: 'ordersPatch',
      object: body
    })

    if ( validation_data.length > 0 ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: validation_data })
      }
    }

    return await PromiseHandler(
      Statement('UPDATE orders SET state=? SET staging_location=? WHERE id=?',
        [body.state,body.staging_location,id])
    )
  }
}
