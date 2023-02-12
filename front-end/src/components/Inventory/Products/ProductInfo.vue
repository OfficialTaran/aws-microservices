<template>
  <div>
     <b-modal
        ref="info-modal"
        :title="loading ? null : product.name"
        :ok-disabled="!updates"
        @ok="submitUpdates"
      >
        <ModalInput
          v-if="modal_action === 'update'"
          :loading="loading"
          label="Product ID"
          :value="product.id"
        />
        <ModalInput
          v-for="(item, key) in properties"
          :key="`property_${key}`"
          :loading="loading"
          :label="item.label"
          :value="item.value"
          :input_type="item.type"
          writable
          @input="value => updateProperty(item.property, value)"
        />
        <div class="mt-2 mb-1 title">Dimensions:</div>
        <ModalInput
          v-for="(item, key) in dimensions"
          :key="`dimensions_${key}`"
          :loading="loading"
          :label="item.label"
          :value="item.value"
          writable
          @input="value => updateDimension(item.dimension, value)"
        />
        <Spinner
          v-if="updating"
          small
        />
      </b-modal> 
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import { isEqual } from 'lodash'
import Spinner from '@common/LoadingSpinner.vue'
import ModalInput from '@common/ModalInput.vue'

export default {
  name: 'ProductInfo',
  components: {
    Spinner,
    ModalInput
  },
  props: {
    modal_action: {
        type: String,
        default: 'update'
    }
  },
  computed: {
    ...mapState({
      product: state => state.inventoryProducts.product,
      product_original: state => state.inventoryProducts.product_original,
      loading: state => state.inventoryProducts.product_loading,
      updating: state => state.inventoryProducts.updating_product
    }),
    dimensions () {
      return [
        {
          label: 'Length',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.length : null,
          dimension: 'length'
        },
        {
          label: 'Thickness',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.thickness : null,
          dimension: 'thickness'
        },
        {
          label: 'Width',
          value: this.product.nominal_dimensions ? this.product.nominal_dimensions.width : null,
          dimension: 'width'
        }
      ]
    },
    properties () {
      return [
      {
          label: 'Display Name',
          value: this.product.name,
          property: 'name',
          type: 'text'
        },
        {
          label: 'Unit Quantity',
          value: this.product.unit_quantity,
          property: 'unit_quantity',
          type: 'number'
        },
        {
          label: 'In Stock',
          value: this.product.in_stock,
          property: 'in_stock',
          type: 'number'
        }
      ]
    },
    updates () {
      return ! isEqual(this.product, this.product_original)
    }
  },
  methods: {
    open (id = null) {
      if (this.modal_action === 'update') {
        this.$store.dispatch('inventoryProducts/getProduct', { id })
      } else if (this.modal_action === 'new') {
        this.$store.dispatch('inventoryProducts/startNewProduct')
      }
      this.$refs['info-modal'].show()
    },
    updateDimension( dimension, value) {
      console.log(value)
      this.$store.commit('inventoryProducts/updateProductDimension', { dimension, value })
    },
    updateProperty( property, value ) {
      if ( !isNaN(value) && (value !== '')) value = parseInt(value)
      this.$store.commit('inventoryProducts/updateProductProperty', { property, value })
    },
    async submitUpdates ( bvModalEvent ) {
      bvModalEvent.preventDefault()
      if (this.modal_action === 'update') {
        await this.$store.dispatch('inventoryProducts/updateProduct')
      } else if (this.modal_action === 'new') {
        await this.$store.dispatch('inventoryProducts/postNewProduct')
      }
      this.$nextTick(() => {
        this.$refs['info-modal'].hide()
      })
    }
  }
}
</script>
