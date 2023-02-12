<template>
  <div>
     <b-modal
        ref="add-modal"
        @ok="AddToCart"
        title="Add To Cart"
        ok-title="Add"
      >
        <div class="d-flex flex-wrap justify-content-center">
          <b-form-input 
            v-model="quantity" 
            type="number"
            size="lg"
            class="w-50 px-3"
            min="1"
            :max="product.in_stock"
          />
        </div>
      </b-modal> 
  </div>
</template>
    
<script>
import { mapState } from 'vuex'

export default {
  name: 'AddToCart',
  props: {
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      quantity: 1
    }
  },computed: {
    ...mapState({
      product: state => state.products.product
    })
  },
  methods: {
    open () {
      this.$refs['add-modal'].show()
    },
    AddToCart () {
      this.$store.commit('cart/addToCart', { 
        id: this.id,
        quantity: this.quantity
      })
      this.quantity = 1
    }
  }
}
</script>
