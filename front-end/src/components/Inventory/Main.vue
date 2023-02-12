<template>
  <div class="mt-5 mx-5">
    <div class="d-flex justify-content-between">
      <b-nav pills class="mb-5">
        <b-nav-item 
          v-for="(item, key) in pages"
          :key="`info_item_${key}`"
          :active="selected_page === item.name"
          @click="selected_page = item.name"
        >
          {{ item.display }}
        </b-nav-item>
      </b-nav>
      <Icon
        v-if="display_add_button"
        :tooltip="add_button_text"
        variant="primary"
        scale="2.5"
        icon="plus-square"
        @click="clickNew()"
      />
    </div>
    <Shipments 
      v-if="selected_page === 'shipments'"
      ref="shipments"
    />
    <Products 
      v-else-if="selected_page === 'products'"
      ref="products"
    />
    <OrderPicking 
      v-else-if="selected_page === 'order_picking'"
      key="order_picking"
      orders_state="needs_picked"
    />
    <OrderPicking 
      v-else-if="selected_page === 'order_pickup'"
      key="order_pickup"
      orders_state="staged"
    />
  </div>
</template>
  
<script>

import Shipments from './Shipments/Shipments.vue';
import OrderPicking from './OrderPicking/OrderPicking.vue';
import Products from './Products/Products.vue'
import Icon from '@common/Icon.vue'

const pages_with_add_button = [
  'shipments',
  'products'
]

const add_text_map = {
  shipments: 'New Shipment',
  products: 'New Product'
}

export default {
  name: 'InventoryMain',
  components: {
    Shipments,
    OrderPicking,
    Products,
    Icon
  },
  data() {
    return {
      pages: [
        {
          name: 'shipments',
          display: 'Shipments'
        },
        {
          name: 'products',
          display: 'Products'
        },
        {
          name: 'order_picking',
          display: 'Order Picking'
        },
        {
          name: 'order_pickup',
          display: 'Order Pickup'
        }
      ],
      selected_page: 'shipments'
    }
  },
  computed: {
    display_add_button () {
      return pages_with_add_button.includes(this.selected_page)
    },
    add_button_text () {
      return this.display_add_button ? add_text_map[this.selected_page] : ''
    }
  },
  methods:  {
    clickNew () {
      this.$refs[this.selected_page].new()
    }
  }
}
</script>