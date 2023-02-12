<template>
  <div>
     <b-modal
        ref="staging-modal"
        :title="`Pick Order ${order_id}`"
        @ok="stageOrder"
      >
        <div class="d-flex">
          <div>Staging Location:</div>
          <b-form-input 
            v-model="staging_location" 
            placeholder="Staging Location"
          />
        </div>
        <Spinner
          v-if="staging"
          small
        />
      </b-modal> 
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import Spinner from '@common/LoadingSpinner.vue'

export default {
  name: 'OrderStagingModal',
  components: {
    Spinner
  },
  computed: {
    ...mapState({
      staging: state => state.orderPicking.updating_order
    })
  },
  data() {
    return {
      staging_location: '',
      order_id: null
    }
  },
  methods: {
    open ( id ) {
      this.order_id = id
      this.$refs['staging-modal'].show()
    },
    async stageOrder (bvModalEvent) {
      bvModalEvent.preventDefault()
      await this.$store.dispatch('orderPicking/updateOrder',{ 
        id: this.order_id, 
        staging_location: this.staging_location,
        order_state: 'staged'
      })
      this.staging_location = ''
      this.order_id = null
    }
  }
}
</script>
