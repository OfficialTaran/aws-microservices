import pkg from 'axios'
const { request } = pkg

let domain = `${window.location.protocol}//${window.location.host}`

const makeRequest = ({ verb = 'GET', route, data = null, params = null }) => {

  const request_object = {
    method: verb,
    url: domain + route
  }

  if (data) {
    request_object.data = data
  }

  if (params) {
    request_object.params = params
  }
  
  return request(request_object)

}

export { makeRequest as request }
