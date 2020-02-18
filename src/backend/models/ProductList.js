const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productListSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: { type: String, default: 'Cart' },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products'
    },
    amount: { type: Number, default: 1 }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const ProductList = mongoose.model('ProductList', productListSchema);

module.exports = ProductList;