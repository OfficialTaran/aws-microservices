import Schema from 'validate'

const products = new Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  nominal_dimensions : {
    thickness: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    length: {
      type: String,
      required: true
    },
  },
  unit_quantity: {
    type: Number,
    required: true
  },
  in_stock: {
    type: Number,
    required: true
  }
})

export { products }