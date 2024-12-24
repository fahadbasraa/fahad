const mongoose = require('mongoose');
const Category = require('./category');  

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',  
    required: true
  },
  picture: String, 
  stock: {
    type: Number,
    default: 0
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;
