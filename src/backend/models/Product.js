const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
  name: { type: String },          // productnaam
  brand: { type: String },            // merk
  images: [{ type: String }],
  category: { type: String },
  description: { type: String },      // omschrijving
  price: { type: Number },             // prijs
  sale: { type: Number, default: 0.5, min: 0, max: 1 }, // Percentage 0 to 1, 0.5 == 50%
  quantityInStock: { type: Number }, //aantal op voorraad
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    text: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model('Product', productSchema);
