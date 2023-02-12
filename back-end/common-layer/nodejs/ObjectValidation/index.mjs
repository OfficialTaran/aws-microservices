// ////////////////////////////////////////////////////////////////////////////
//
//  All Schemas should be defined in their own file in the Schemas directory
//  and imported into this file. Each Schema needs to be added to the Schemas
//  arry.
//
import { products } from './Schemas/products.mjs'
import { orders, ordersPatch } from './Schemas/orders.mjs'
import { shipments } from './Schemas/shipments.mjs'

const Schemas = {
  products,
  orders,
  shipments,
  ordersPatch
}

// ////////////////////////////////////////////////////////////////////////////
//
//  Test an input object's format against a known schema.
//
//  Inputs:
//    schema: the name of the schema to test against
//    object: the object to test
//
//  Output: An array of errors, each error will have a path of the related
//          erroneous property ( [].path ) and an error message ( [].message )
//
const validateObject = ({ schema, object}) => {
  return Schemas[schema].validate(object).map(error => {
    return {
      path: error.path,
      message: error.message
    }
  })
}

export { validateObject }