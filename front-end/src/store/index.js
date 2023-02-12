import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products.js'
import cart from './modules/cart.js'
import orders from './modules/orders.js'
import shipments from './modules/shipments.js'
import orderPicking from './modules/orderPicking.js';
import inventoryProducts from './modules/inventoryProducts.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    products,
    cart,
    orders,
    shipments,
    orderPicking,
    inventoryProducts
  }
});