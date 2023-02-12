<template>
  <b-modal
    ref="info-modal"
    @ok="$emit('close')"
    size="lg"
    ok-only
  >
    <ModalInput
      v-for="(item, key) in properties"
      :key="`property_${key}`"
      :loading="loading"
      :label="item.label"
      :value="item.value"
    />
    <b-table 
      v-if="!loading"
      striped 
      hover 
      class="mt-4"
      :items="shipment.goods_received"
    />
  </b-modal> 
</template>
    
<script>
import { mapState } from 'vuex'
import { displayDate } from '@utils/date.js'
import ModalInput from '@common/ModalInput.vue'

export default {
  name: 'OrderInfo',
  components: {
    ModalInput
  },
  computed: {
    ...mapState({
      shipment: state => state.shipments.shipment,
      loading: state => state.shipments.shipment_loading
    }),
    properties () {
      return [
        {
          label: 'Shipment ID',
          value: this.shipment.id
        },
        {
          label: 'Date Received',
          value: displayDate(this.shipment.date_received)
        }
      ]
    }
  },
  methods: {
    open ( id ) {
      this.$store.dispatch('shipments/getShipment', { id })
      this.$refs['info-modal'].show()
    }
  }
}
</script>
<style scoped>
.label {
  font-weight: 500;
}
.title {
  font-weight: 700;
}
</style>
