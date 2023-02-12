import { request } from '@utils/api.js'

const state = {
  order_list: [],
  loading_orders: false,
  order: {},
  order_loading: false
}

const actions = {
  async listOrders ({ commit, state }, reset_cache = false) {
    //ignore if cashed
    if (JSON.stringify(state.order_list) !== '[]' 
    && !reset_cache) return

    commit('setLoading', { loading: true })

    const orders = await request({ route: '/api/orders' })
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
    const order = await request({ route: `/api/orders/${id}` })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setOrder', { order })
    commit('setOrderLoading', { loading: false })
  },
  async cancelOrder({ commit, dispatch }, { id }) {
    commit('setCancellingOrder', { cancelling: true })
    await request({ 
      route: `/api/orders/${id}`,
      verb: 'DELETE'
    }).catch(err => console.error(err))
    dispatch('listOrders',{ reset_cache: true })
    commit('setCancellingOrder', { loading: false })
    commit('products/setProductList',{ products: [] },{root: true})
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
  setCancellingOrder ( state, { cancelling }) {
    state.cancelling = cancelling
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}