import { request } from '@utils/api.js'
import { cloneDeep } from 'lodash'

const state = {
  product_list: [],
  loading: false,
  product: {},
  product_original: {},
  product_loading: false,
  updating_product: false
}

const actions = {
  async listProducts ({ commit, state }) {
    //ignore if cashed
    if (JSON.stringify(state.product_list) !== '[]') return

    commit('setLoading', { loading: true })

    const products = await request({ route: '/api/inventory/products' })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setProductList', { products })
    commit('setLoading', { loading: false })
  },
  async getProduct ({ commit, state }, { id }) {
    //ignore if cashed
    if ((JSON.stringify(state.product) !== '{}')
      && (state.product.id === id)) return

    commit('setProductLoading', { loading: true })
    const product = await request({ route: `/api/inventory/products/${id}` })
      .then(res => res.data)
      .catch(err => console.error(err))

    commit('setProduct', { product })
    commit('setProductLoading', { loading: false })
  },
  async updateProduct ({ commit, state}) {
    commit('setUpdatingProduct', { updating: true })

    await request({ 
      route: `/api/inventory/products/${state.product.id}`,
      verb: 'PUT',
      data: state.product
    }).catch(err => console.error(err))

    commit('setProduct',{ product: {} })
    commit('setUpdatingProduct', { updating: false })
  },
  startNewProduct ({ commit }) {
    commit('setProduct',{ product: {
      nominal_dimensions: {
        length: '',
        width: '',
        thickness: ''
      },
      unit_quantity: 0,
      name: ''
    } })
  },
  async postNewProduct ({ commit, state }) {
    commit('setUpdatingProduct', { updating: true })

    await request({ 
      route: '/api/inventory/products',
      verb: 'POST',
      data: state.product
    }).catch(err => console.error(err))

    commit('setProduct',{ product: {} })
    commit('setUpdatingProduct', { updating: false })
  }
}

const mutations = {
  setLoading ( state, { loading }) {
    state.loading = loading
  },
  setProductList ( state, { products }) {
    state.product_list = products
  },
  setProduct ( state, { product }) {
    state.product = product
    state.product_original = cloneDeep(product)
  },
  setProductLoading ( state, { loading }) {
    state.product_loading = loading
  },
  updateProductDimension ( state, { dimension, value }) {
    const dimensions = cloneDeep(state.product.nominal_dimensions)
    dimensions[dimension] = value
    state.product.nominal_dimensions = dimensions
  },
  updateProductProperty ( state, { property, value }) {
    const product = cloneDeep(state.product)
    product[property] = value
    state.product = product
  },
  setUpdatingProduct ( state, { updating }) {
    state.updating_product = updating
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
