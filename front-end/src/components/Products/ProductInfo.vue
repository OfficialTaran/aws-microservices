<template>
  <div>
     <b-modal
        ref="info-modal"
        @ok="$emit('close')"
        :title="loading ? null : product.name"
        ok-only
      >
        <ModalInput
          v-for="(item, key) in product_info"
          :key="`info_${key}`"
          :loading="loading"
          :label="item.label"
          :value="item.value"
        />
        <div class="mt-2 mb-1 title">Dimensions:</div>
        <ModalInput
          v-for="(item, key) in dimensions"
          :key="`dimensions_${key}`"
          :loading="loading"
          :label="item.label"
          :value="item.value"
        />
      </b-modal> 
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import ModalInput from '@common/ModalInput.vue'

export default {
  name: 'ProductInfo',
  components: {
    ModalInput
  },
  computed: {
    ...mapState({
      product: state => state.products.product,
      loading: state => state.products.product_loading
    }),
    dimensions () {
      return [
        {
          label: 'Length',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.length : null
        },
        {
          label: 'Thickness',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.thickness : null
        },
        {
          label: 'Width',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.width : null
        }
      ]
    },
    product_info () {
      return [
        {
          label: 'Product ID',
          value: this.product.id
        },
        {
          label: 'In Stock',
          value: this.product.in_stock
        }
      ]
    }
  },
  methods: {
    open ( id ) {
      this.$store.dispatch('products/getProduct', { id })
      this.$refs['info-modal'].show()
    }
  }
}
</script>