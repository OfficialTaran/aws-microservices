import { request } from '@utils/api.js'

const state = {
  order_list: [],
  loading_orders: false,
  order: {},
  order_loading: false,
  updating_order: false,
  displayed_orders_state: ''
}

const actions = {
  async listOrders ({ commit, state }, { orders_state, reset_cache = false }) {
    //ignore if cashed
    if (JSON.stringify(state.order_list) !== '[]'
      && !reset_cache) return

    commit('setDisplayedOrdersState', { orders_state })
    commit('setLoading', { loading: true })

    const orders = await request({ 
      route: '/api/inventory/orders',
      params: { state: orders_state }
    })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setOrderList', { orders })
    commit('setLoading', { loading: false })
  },
  async getOrder ({ commit, state }, { id }) {
    //ignore if cashed
    if ((JSON.stringify(state.order) !== '{}')
      && (state.order.id === id)) return

    commit('setOrderLoading', { loading: true })
    const order = await request({ route: `/api/inventory/orders/${id}` })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setOrder', { order })
    commit('setOrderLoading', { loading: false })
  },
  async updateOrder ({ commit, dispatch, state }, { id, staging_location, order_state }) {
    commit('setUpdatingOrder', { staging: true })

    const data = {
      id,
      staging_location,
      state: order_state
    }
    await request({ 
      route: `/api/inventory/orders/${id}`,
      verb: 'PATCH',
      data
    }).catch(err => console.error(err))

    dispatch('listOrders',{ reset_cache: true, orders_state: state.displayed_orders_state })
    commit('setUpdatingOrder', { staging: false })
  }
}

const mutations = {
  setOrderList ( state, { orders }) {
    state.order_list = orders
  },
  setLoading ( state, { loading }) {
    state.loading_orders = loading
  },
  setOrder ( state, { order }) {
    state.order = order
  },
  setOrderLoading ( state, { loading }) {
    state.order_loading = loading
  },
  clearOrderListCache ( state) {
    state.orders = []
  },
  setUpdatingOrder ( state, { staging }) {
    state.updating_order = staging
  },
  setDisplayedOrdersState ( state, { orders_state }) {
    state.displayed_orders_state = orders_state
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}