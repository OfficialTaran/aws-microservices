<template>
  <div>
    <div class="mx-5 mt-4">
      <div class="d-flex justify-content-between">
        <div class="title border-bottom flex-fill">Your Cart:</div>
        <b-button 
          variant="outline-primary"
          class="d-lg-none ml-4"
          @click="placeOrder()"
        >
          Place Order
        </b-button>
      </div> 
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-fill">
          <b-card
            v-for="(item, key) in items_in_cart"
            :key="`list_item_${key}`"
            :title="item.name"
            class="m-2 cart-item"
          >
            <div>
              <div>
                <div class="d-flex">
                  <div class="label mr-3">ID:</div>
                  <div>{{ item.id }}</div>
                </div>
                <div class="d-flex">
                  <div class="label mr-3">Quantity:</div>
                  <div>{{ item.quantity }}</div>
                </div>
              </div>
              <div class="ml-auto align-self-stretch d-flex mt-2">
                <b-button 
                  class="mx-2 align-self-stretch" 
                  variant="outline-primary"
                  @click="openUpdateQuantity(item.id)"
                >
                  Update Quantity
                </b-button>
                <b-button 
                  class="mx-2 align-self-stretch" 
                  variant="outline-danger"
                  @click="removeFromCart(item.id)"
                >
                  Remove
                </b-button>
              </div>
            </div>
          </b-card>
        </div>
        <b-card
          title="Place Order"
          class="m-2 checkout d-none d-lg-block"
        >
          <div class="text-center">
            <b-button
              :disabled="items_in_cart.length === 0"
              class="mx-2 mt-5 checkout-button align-middle" 
              variant="outline-primary"
              @click="placeOrder()"
            >
              Place Order
            </b-button>
            <Spinner
              v-if="placing_order"
              small
            />
          </div>
        </b-card>
      </div>
    </div>
    <b-modal
      ref="quantity-modal"
      title="Update Quantity"
      ok-only
    >
      <div class="d-flex flex-wrap justify-content-center">
        <b-form-input 
          v-model="item_quantity" 
          type="number"
          size="lg"
          class="w-50 px-3"
          min="1"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import Spinner from '@common/LoadingSpinner.vue'

export default {
  name: 'CartMain',
  async created () {
    await this.load()
  },
  components: {
    Spinner
  },
  data () {
    return {
      selected_id: null
    }
  },
  computed: {
    ...mapState({
      cart: state => state.cart.cart,
      products: state => state.products.product_list,
      placing_order: state => state.cart.placing_order
    }),
    items_in_cart () {
      return cloneDeep(this.cart).map(item => {
        item.name = this.products.find(i => i.id === item.id).name
        return item
      })
    },
    item_quantity: {
      get () {
        return this.selected_id ?
          this.cart.find(item => item.id === this.selected_id).quantity :
          1
      },
      set ( val ) {
        this.$store.commit('cart/updateQuantity',{ 
          id: this.selected_id, 
          quantity: Number(val) 
        })
      }
    }
  },
  methods: {
    async load () {
      await this.$store.dispatch('products/listProducts')
    },
    removeFromCart ( id ) {
      this.selected_id = null
      this.$store.commit('cart/removeFromCart',{ id })
    },
    openUpdateQuantity ( id ) {
      this.selected_id = id
      this.$refs['quantity-modal'].show()
    },
    async placeOrder () {
      await this.$store.dispatch('cart/placeOrder')
    }
  }
}
</script>
<style scoped>
.cart-item {
  max-width: 600px
}
.title {
  font-size: xx-large
}
.checkout {
  width: 400px
}
.checkout-button {
  width: 300px
}
</style>
