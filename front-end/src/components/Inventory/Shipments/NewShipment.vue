<template>
  <b-modal
    ref="new-shipment-modal"
    size="lg"
    title="New Shipment"
    :ok-disabled="!updates"
    @ok="submitNewShipment"
  >
    <div class="d-flex justify-content-end">
      <b-button 
        variant="primary"
        @click="addRow"
      >
        Add Item
      </b-button>
    </div>
    <b-table 
      striped 
      hover 
      class="mt-4"
      :fields="fields"
      :items="shipment.goods_received"
    >
      <template #cell()="data">
        <b-form-input
          :value="data.value"
          type="text"
          @update="value => updateField(data.index, data.field.key, value)"
        />
      </template>
      <template 
        #cell(remove_button)="data"
      >
        <b-icon-x-circle
          variant="danger"
          font-scale="2"
          shift-v="-1"
          class="clickable"
          @click="removeRow(data.index)"
        />
      </template>
    </b-table>
    <Spinner
      v-if="posting"
      small
    />
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import { isEqual } from 'lodash'
import Spinner from '@common/LoadingSpinner.vue'

const blank_shipment = {
  goods_received: []
}

export default {
  name: 'NewShipment',
  components: {
    Spinner
  },
  computed: {
    ...mapState({
      shipment: state => state.shipments.shipment,
      posting: state => state.shipments.posting_new_shipment
    }),
    updates () {
      return ! isEqual(blank_shipment, this.shipment)
    }
  },
  data() {
    return {
      fields: [
        { key: 'product_id' },
        { key: 'unit_quantity' },
        { key: 'remove_button', label: '', class: 'button-column' }
      ]
    }
  },
  methods: {
    open () {
      this.$refs['new-shipment-modal'].show()
      this.$store.commit('shipments/startNewShipment')
    },
    updateField ( index, field, value ) {
      this.$store.commit('shipments/updateNewShipmentField',
        { index, field, value })
    },
    addRow () {
      this.$store.commit('shipments/addRowToShipment')
    },
    removeRow ( index ) {
      this.$store.commit('shipments/removeRowFromShipment', { index })
    },
    async submitNewShipment ( bvModalEvent ) {
      bvModalEvent.preventDefault()
      await this.$store.dispatch('shipments/postNewShipment')
    }
  }
}

</script>
<style scoped>
.button-column {
  width: 10%;
}
</style>