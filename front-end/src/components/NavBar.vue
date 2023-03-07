<template>
<div>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand 
      href="#"
      @click="$emit('goHome')"
    > 
      Taran's Lumber Yard
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item @click="$emit('goToInventory')">Inventory Page</b-nav-item>
      <b-nav-item @click="$emit('goToOrders')">Orders</b-nav-item>
      <b-nav-item @click="login()">Log In</b-nav-item>
      <b-nav-item @click="$emit('goToCart')"><b-icon-cart-3/></b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</div>
</template>
  
<script>
import { BIconCart3 } from 'bootstrap-vue'
import { UserManager } from '@utils/api.js'

export default {
  name: 'NavBar',
  components: {
    BIconCart3
  },
  data () {
    return {
      login_link: 'https://taranslumberyard.auth.us-east-1.amazoncognito.com/login?client_id=5pb45an8os06kikt5j64udts0&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=http%3A%2F%2Flocalhost%3A8080'
    }
  },
  methods: {
    async login () {
      await UserManager.signinRedirect().catch(err => console.error(err))
    }
  }
}
</script>