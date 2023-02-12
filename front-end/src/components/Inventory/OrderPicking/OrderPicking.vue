<template>
  <div>
    <Spinner v-if="loading"/>
    <div v-else>
      <b-card
        v-for="(item,key) in orders"
        :key="`list_item_${key}`"
        class="mt-2"
      >
        <div class="d-flex justify-content-between">
          <div 
            v-if="orders_state === 'needs_picked'"
            class="inline-card-text"
          >
            {{ item.id }}
          </div>
          <div 
            v-if="orders_state === 'staged'"
            class="inline-card-text"
          >
            {{ item.id }} - {{ item.staging_location }}
          </div>
          <div class="d-flex justify-content-end">
            <Icon
              v-if="orders_state === 'needs_picked'"
              tooltip="Stage Order"
              scale="2"
              icon="cart-check"
              variant="success"
              @click="openStageOrderModal(item.id)"
            />
            <Icon
              v-if="orders_state === 'staged'"
              tooltip="Complete Order"
              scale="2"
              icon="bag-check"
              variant="success"
              @click="openCompleteOrderModal(item.id)"
            />
            <Icon
              tooltip="Order Info"
              scale="2"
              icon="info-circle"
              variant="info"
              @click="openOrderModal(item.id)"
            />
          </div>
        </div>
      </b-card>
      <OrderInfo
        ref="order-info-modal"
      />
      <StageOrderModal
        ref="stage-order-modal"
      />
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { displayDate } from '@utils/date.js'
import OrderInfo from './OrderInfo.vue'
import StageOrderModal from './StageOrderModal.vue'
import Spinner from '@common/LoadingSpinner.vue'
import Icon from '@common/Icon.vue'

export default {
  name: 'OrderPickingMain',
  props: {
    orders_state: {
        type: String,
        default: 'needs_picked'
    }
  },
  async created () {
    await this.load()
  },
  components: {
    StageOrderModal,
    OrderInfo,
    Spinner,
    Icon
  },
  computed: {
    ...mapState({
      orders: state => state.orderPicking.order_list,
      loading: state => state.orderPicking.loading_orders
    })
  },
  methods: {
    displayDate,
    async load () {
      await this.$store.dispatch('orderPicking/listOrders', { 
        orders_state: this.orders_state,
        reset_cache: true
      })
    },
    async openOrderModal ( id ) {
      this.$refs['order-info-modal'].open(id)
    },
    async openStageOrderModal ( id ) {
      this.$refs['stage-order-modal'].open(id)
    },
    async openCompleteOrderModal ( id ) {
      this.$bvModal.msgBoxConfirm(
          `Picking Up order ${id}`, {
          title: 'Please Confirm',
        })
        .then(value => {
          if (value) this.$store.dispatch('orderPicking/updateOrder', { 
            id,
            staging_location: 'none',
            order_state: 'complete'
          })
        })
    }
  }
}
</script>
