import Schema from 'validate'
import { timestampValidator } from '../validators.mjs'

const acceptable_states = [
  'needs_picked',
  'staged',
  'complete',
  'cancelled'
]

const orders = new Schema({
  id: {
    type: String
  },
  customer: {
    type: String,
    required: true
  },
  date_created: {
    type: String,
    required: true,
    use: { timestampValidator }
  },
  state: {
    type: String,
    required: true,
    enum: acceptable_states
  },
  staging_location: {
    type: String,
    required: true
  },
  goods_ordered: {
    type: Array,
    length: {
      min: 1
    },
    each: {
      product_id: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  }
})

const ordersPatch = new Schema({
  id: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: acceptable_states
  },
  staging_location: {
    type: String,
    required: true
  }
})

export { orders, ordersPatch, acceptable_states }