const mongoose = require('mongoose');

const catschema = new mongoose.Schema({
  name : String,
picture: String,
  
});

let Category  = mongoose.model('category', catschema);
module.exports = Category