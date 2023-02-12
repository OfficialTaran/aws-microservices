<template>
  <div>
    <Spinner v-if="loading"/>
    <div v-else>
      <b-card
        v-for="(item,key) in shipments"
        :key="`list_item_${key}`"
        class="mt-2"
      >
        <div class="d-flex justify-content-between">
          <div class="inline-card-text">{{ displayDate(item.date_received) }}</div>
          <Icon
            tooltip="Shipment Info"
            scale="2"
            variant="info"
            icon="info-circle"
            @click="openShipmentModal(item.id)"
          />
        </div>
      </b-card>
      <ShipmentInfo
        ref="shipment-info-modal"
      />
      <NewShipment
        ref="new-shipment-modal"
      />
    </div>
  </div>
</template>

<script>
import { displayDate } from '@utils/date.js'
import { mapState } from 'vuex'
import ShipmentInfo from './ShipmentInfo.vue'
import NewShipment from './NewShipment.vue'
import Spinner from '@common/LoadingSpinner.vue'
import Icon from '@common/Icon.vue'

export default {
  name: 'ShipmentsMain',
  async created () {
    await this.load()
  },
  components: {
    ShipmentInfo,
    Spinner,
    NewShipment,
    Icon
  },
  computed: {
    ...mapState({
      shipments: state => state.shipments.shipment_list,
      loading: state => state.shipments.loading
    })
  },
  methods: {
    displayDate,
    async load () {
      await this.$store.dispatch('shipments/listShipments')
    },
    openShipmentModal( id ) {
      this.$refs['shipment-info-modal'].open(id)
    },
    new () {
      this.$refs['new-shipment-modal'].open()
    }
  }
}
</script>
