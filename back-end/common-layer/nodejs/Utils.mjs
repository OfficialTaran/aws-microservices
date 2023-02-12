
// ////////////////////////////////////////////////////////////////////////////
//
//  Handle a promise and turn response into a Lambda response object
//
//  Inputs: Unresolved Promise
//
//  Output: A Promise that will resolve to a lambda response object
//
//
const PromiseHandler = ( prom ) => {
  return prom.then(data => {
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }).catch(error => {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        msg: 'Internal Service Error'
      })
    }
  })
}

export { PromiseHandler }