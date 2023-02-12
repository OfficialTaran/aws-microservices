import { Statement, InsertItem } from '/opt/nodejs/dynamoDB.mjs'
import { validateObject } from '/opt/nodejs/ObjectValidation/index.mjs'
import { BadProductIDError, InvalidQuantityError } from '/opt/nodejs/Errors.mjs'
import { PromiseHandler } from '/opt/nodejs/Utils.mjs'

export async function rootHandler(event) {
  const body = JSON.parse(event.body || '{}')
  const id = (event.pathParameters && ('id' in event.pathParameters)) ?
    event.pathParameters.id : null

  return await handlers[event.httpMethod]({id, body})
}

const state_map = {
  needs_picked: 'In Progress',
  staged: 'Ready For Pickup',
  complete: 'Complete',
  cancelled: 'Cancelled'
}

const cancellable_states = [
  'needs_picked',
  'staged'
]

const handlers = {
  GET : async ({ id = null }) => {
    const response = id ?
      Statement(`SELECT state, date_created, id, goods_ordered FROM orders WHERE id='${id}'`) :
      Statement('SELECT state, date_created, id FROM orders')

    return await PromiseHandler(response.then(data => {
      data = data.map(item => {
        item.state = state_map[item.state]
        return item
      })
      if (id) data = data[0]

      return data
    }))
  },
  POST: async ({ body = null }) => {

    const date_now = new Date()
    body.date_created = date_now.toISOString()

    const validation_data = validateObject({
      schema: 'orders',
      object: body
    })

    if ( validation_data.length > 0 ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: validation_data })
      }
    }

    try {
      await updateProducts({ goods_ordered: body.goods_ordered })
    }
    catch(error) {
      if (['InvalidQuantityError','BadProductIDError' ].includes(error.name)) {
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
      TableName: 'orders',
      data: body
    }))
  },
  DELETE: async ({ id = null }) => {

    try {
      const order = await Statement(`SELECT goods_ordered, state FROM orders WHERE id='${id}'`)
        .then(orders => orders[0])

      if (! cancellable_states.includes(order.state)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: `Can't cancel order in state ${state_map[order.state]}` })
        }
      }

      await updateProducts({ goods_ordered: order.goods_ordered, operation: 'add' })
    }
    catch(error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          msg: 'Internal Service Error'
        })
      }
    }

    return await PromiseHandler(
      Statement('UPDATE orders SET state=? SET staging_location=? WHERE id=?',
      ['cancelled','none',id]))
  }
}

const updateProducts = async ( { goods_ordered, operation = 'subtract' } ) => {
  // get products
  const products = await Statement('SELECT id, in_stock FROM products')

  const order_quantities = []
  goods_ordered.forEach(item => {
    const product = products.find(p => p.id === item.product_id)

    // error if one of the IDs is not found
    if (product === undefined) {
      throw new BadProductIDError(`product with ID: ${item.product_id} not found`)
    }

    const index = order_quantities.findIndex(i => i.product_id === item.product_id)
    if (index === -1) {
      order_quantities.push({
        product_id: item.product_id,
        quantity: Number(item.quantity)
      })
    } else {
      order_quantities[index].quantity += item.quantity
    }
  })

  if ( operation === 'subtract' ) {
    // Ensure quantities are valid
    order_quantities.forEach(item => {
      const product = products.find(p => p.id === item.product_id)
      if (product.in_stock < item.quantity) {
        throw new InvalidQuantityError(`product ${item.product_id} in_stock is less than ordered quantity`)
      }
    })
  }

  const operator = operation_map[operation]

  // update quantities in products table
  const promises = order_quantities.map(item => {
    return Statement(`UPDATE products SET in_stock = in_stock ${operator} ? WHERE id=?`,
      [item.quantity,item.product_id])
  })

  // await promise map of update statements
  return await Promise.all(promises)
}

const operation_map = {
  subtract: '-',
  add: '+'
}
