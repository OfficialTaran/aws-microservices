import { request } from '@utils/api.js'
import { cloneDeep } from 'lodash'

const state = {
  shipment_list: [],
  loading: false,
  shipment: {},
  shipment_loading: false,
  posting_new_shipment: false
}

const actions = {
  async listShipments ({ commit, state }, reset_cache = false) {
    //ignore if cashed
    if (JSON.stringify(state.shipment_list) !== '[]'
    && !reset_cache) return

    commit('setLoading', { loading: true })

    const shipments = await request({ route: '/api/inventory/shipments' })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setShipmentList', { shipments })
    commit('setLoading', { loading: false })
  },
  async getShipment ({ commit, state }, { id }) {
    //ignore if cashed
    if ((JSON.stringify(state.shipment) !== '{}')
      && (state.shipment.id === id)) return

    commit('setShipmentLoading', { loading: true })
    const shipment = await request({ route: `/api/inventory/shipments/${id}` })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setShipment', { shipment })
    commit('setShipmentLoading', { loading: false })
  },
  async postNewShipment ({ commit, state, dispatch }) {
    commit('setPostingNewShipment', { posting: true })

    await request({ 
      route: '/api/inventory/shipments',
      verb: 'POST',
      data: state.shipment
    }).catch(err => console.error(err))

    commit('setShipment', { shipment: {} })
    commit('setPostingNewShipment', { posting: false })
    dispatch('listShipments',{ reset_cache: true })
  }
}

const mutations = {
  setLoading ( state, { loading }) {
    state.loading = loading
  },
  setPostingNewShipment ( state, { posting }) {
    state.posting_new_shipment = posting
  },
  setShipmentList ( state, { shipments }) {
    state.shipment_list = shipments
  },
  setShipment ( state, { shipment }) {
    state.shipment = shipment
  },
  setShipmentLoading ( state, { loading }) {
    state.shipment_loading = loading
  },
  startNewShipment( state ) {
    state.shipment = {
      goods_received: []
    }
  },
  updateNewShipmentField ( state, { index, field, value }) {
    const goods_received = cloneDeep(state.shipment.goods_received)
    goods_received[index][field] = (field === 'unit_quantity') ? Number(value): value
    state.shipment.goods_received = goods_received
  },
  addRowToShipment( state ) {
    state.shipment.goods_received.push({
      product_id: '',
      unit_quantity: 1
    })
  },
  removeRowFromShipment( state, { index }) {
    state.shipment.goods_received.splice(index, 1)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}