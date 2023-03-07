import pkg from 'axios'
import Oidc from 'oidc-client'
const { request } = pkg

const domain = window.location.origin

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

const UserManager = new Oidc.UserManager({
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Fi4vdm4dn',
  client_id: '5pb45an8os06kikt5j64udts0',
  redirect_uri: domain,
  response_type: 'code',
  scope: 'aws.cognito.signin.user.admin',
  userStore: new Oidc.WebStorageStateStore()
})

const tokenExchange = async () => {
  const params = new URLSearchParams(window.location.search.substring(1))
  if(params.has('code') && params.has('state')) {
    UserManager.signinRedirectCallback().then(user => {
      console.log(user)
      const url = document.location.href
      window.history.pushState({}, "", url.split("?")[0])
    })
  }
}

export { makeRequest as request, tokenExchange, UserManager }
