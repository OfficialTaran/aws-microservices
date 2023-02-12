<template>
  <div>
    <Spinner v-if="loading"/>
    <div 
      class="list d-flex flex-wrap justify-content-center"
    >
      <b-card
        v-for="(item, key) in products"
        :key="`list_item_${key}`"
        :title="item.name"
        class="m-2 card"
      >
        <div class="d-flex justify-content-end">
          <Icon
            tooltip="Product Info"
            variant="info"
            scale="1.5"
            icon="info-circle"
            @click="openProductInfo(item.id)"
          />
          <Icon
            tooltip="Add To Cart"
            icon="cart-3"
            scale="1.5"
            @click="openAddToCart(item.id)"
          />
        </div>
      </b-card>
    </div>
    <ProductInfo
      ref="product-info-modal"
      @close="selected_id = null"
    />
    <AddToCart
      ref="add-to-cart-modal"
      :id="selected_id"
      :name="selected_name"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import ProductInfo from './ProductInfo.vue'
import AddToCart from './AddToCart.vue'
import Spinner from '@common/LoadingSpinner.vue'
import Icon from '@common/Icon.vue'

export default {
  name: 'ProductsMain',
  components: {
    ProductInfo,
    AddToCart,
    Spinner,
    Icon
  },
  async created () {
    await this.load()
  },
  data () {
    return {
      selected_id: null
    }
  },
  computed: {
    ...mapState({
      products: state => state.products.product_list,
      loading: state => state.products.loading
    }),
    selected_name () {
      return this.products.filter(p => p.id === this.selected_id).name
    }
  },
  methods: {
    async load () {
      await this.$store.dispatch('products/listProducts')
    },
    openProductInfo( id ) {
      this.selected_id = id
      this.$refs['product-info-modal'].open(id)
    },
    openAddToCart( id ) {
      this.selected_id = id
      this.$refs['add-to-cart-modal'].open()
    }
  }
}
</script>
<style scoped>
.list {
  width: 75vw;
  margin: auto;
}
.card {
  width: 400px
}
</style>
