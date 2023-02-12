<template>
  <div>
    <Spinner v-if="loading"/>
    <div v-else>
      <b-card
        v-for="(item,key) in products"
        :key="`list_item_${key}`"
        class="mt-2"
      >
        <div class="d-flex justify-content-between">
          <div class="inline-card-text">
            {{ item.name }}
          </div>
          <Icon
            tooltip="Product Info"
            scale="2"
            icon="info-circle"
            variant="info"
            @click="openProductModal(item.id)"
          />
        </div>
      </b-card>
    </div>
    <ProductInfo 
      ref="product-info-modal"
      modal_action="update"
    />
    <ProductInfo 
      ref="new-product-modal"
      modal_action="new"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import Spinner from '@common/LoadingSpinner.vue'
import ProductInfo from './ProductInfo.vue'
import Icon from '@common/Icon.vue'

export default {
  name: 'InventoryProductsMain',
  async created () {
    await this.load()
  },
  components: {
    Spinner,
    ProductInfo,
    Icon
  },
  computed: {
    ...mapState({
      products: state => state.inventoryProducts.product_list,
      loading: state => state.inventoryProducts.loading
    })
  },
  methods: {
    async load () {
      await this.$store.dispatch('inventoryProducts/listProducts')
    },
    async openProductModal ( id ) {
      this.$refs['product-info-modal'].open(id)
    },
    new () {
      this.$refs['new-product-modal'].open()
    }
  }
}
</script>
