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
      <b-nav-item>Log In</b-nav-item>
      <b-nav-item @click="$emit('goToCart')"><b-icon-cart-3/></b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</div>
</template>
  
<script>
import { BIconCart3 } from 'bootstrap-vue'

export default {
  name: 'NavBar',
  components: {
    BIconCart3
  }
}
</script>