import { Statement, InsertItem } from '/opt/nodejs/dynamoDB.mjs'
import { validateObject } from '/opt/nodejs/ObjectValidation/index.mjs'
import { BadProductIDError } from '/opt/nodejs/Errors.mjs'
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
      Statement(`SELECT * FROM shipments WHERE id='${id}'`).then(data => data[0]) :
      Statement('SELECT date_received, id FROM shipments')

    return await PromiseHandler(response)
  
  },
  POST: async ({ body = null }) => {

    const date_now = new Date()
    body.date_received = date_now.toISOString()

    const validation_data = validateObject({
      schema: 'shipments',
      object: body
    })

    if ( validation_data.length > 0 ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: validation_data })
      }
    }

    try {
      await updateProducts(body.goods_received)
    }
    catch(error) {
      if (error.name === 'BadProductIDError') {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: error.message })
        }
      } else {
        console.error(error)
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            msg: 'Internal Service Error'
          })
        }
      }
    }

    return await PromiseHandler(InsertItem({
      TableName: 'shipments',
      data: body
    }))
  }
}

const updateProducts = async ( goods_received ) => {
  // get products
  const products = await Statement('SELECT id, unit_quantity FROM products')

  // get list of updates to make
  const received_quantities = []
  goods_received.forEach(item => {
    const product = products.find(p => p.id === item.product_id)

    // error if one of the IDs is not found
    if (product === undefined) {
      throw new BadProductIDError(`product with ID: ${item.product_id} not found`)
    }

    // add to received_quantities
    const index = received_quantities.findIndex(i => i.id === item.product_id)
    if (index === -1) {
      // new item
      received_quantities.push({
        id: item.product_id,
        quantity: product.unit_quantity * item.unit_quantity
      })
    } else {
      // duplicate ID, add both quantities
      received_quantities[index].quantity += product.unit_quantity * item.unit_quantity
    }
  })

  // update quantities in products table
  const promises = received_quantities.map(item => {
    return Statement('UPDATE products SET in_stock = in_stock + ? WHERE id=?',
      [item.quantity,item.id])
  })

  // await promise map of update statements
  return await Promise.all(promises)
}