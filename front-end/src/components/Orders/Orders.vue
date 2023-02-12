<template>
  <div>
    <Spinner v-if="loading"/>
    <div
      v-else
      class="mx-5 mt-3"
    >
      <b-card
        v-for="(item,key) in orders"
        :key="`list_item_${key}`"
        class="mt-2"
      >
        <div class="d-flex justify-content-between">
          <div class="inline-card-text">
            {{ displayDate(item.date_created) }}
            -
            {{ item.state }}
          </div>
          <div class="d-flex justify-content-end">
            <Icon
              tooltip="Order Info"
              variant="info"
              scale="2"
              icon="info-circle"
              @click="openOrderModal(item.id)"
            />
            <Icon
              v-if="canCancel(item.state)"
              tooltip="Cancel Order"
              variant="danger"
              scale="2"
              icon="x-square"
              @click="openConfirmCancelModel(item.id)"
            />
          </div>
        </div>
      </b-card>
    </div>
    <OrderInfo
      ref="order-info-modal"
    />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { displayDate } from '@utils/date.js'
import OrderInfo from './OrderInfo.vue'
import Spinner from '@common/LoadingSpinner.vue'
import Icon from '@common/Icon.vue'

const cancellable_states = [
  'In Progress',
  'Ready For Pickup'
]

export default {
  name: 'OrdersMain',
  async created () {
    await this.load()
  },
  components: {
    OrderInfo,
    Spinner,
    Icon
  },
  computed: {
    ...mapState({
      orders: state => state.orders.order_list,
      loading: state => state.orders.loading_orders
    })
  },
  methods: {
    displayDate,
    async load () {
      await this.$store.dispatch('orders/listOrders')
    },
    async openOrderModal ( id ) {
      this.$refs['order-info-modal'].open(id)
    },
    openConfirmCancelModel ( id ) {
      this.$bvModal.msgBoxConfirm(
          `Please confirm that you want to cancel order ${id}`, {
          title: 'Please Confirm',
        })
        .then(value => {
          if (value) this.$store.dispatch('orders/cancelOrder', { id })
        })
    },
    canCancel( state ) {
      return cancellable_states.includes(state)
    }
  }
}
</script>
