const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")


const app = express();
app.use(express.static("uploads"));

app.use('/uploads', express.static('uploads'));


app.use(session({
    secret : "fahad",
    resave : false,
    saveUninitialized : true
  }))
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));


const category = require("./routes/admin/catRout")
app.use(category)
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);


const product = require("./routes/admin/prodRoutes")
app.use(product)

const user = require("./routes/admin/user")
app.use(user)

let connectionString = "mongodb://localhost:27017/fahad";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

  app.get("/",(req,res)=>{
    res.render('home')
  })

app.listen(8000, () => {
  console.log("Server started at localhost:5000");
});

app.get('/cart', (req, res) => {
  if (!req.session.cart || req.session.cart.items.length === 0) {
      return res.status(200).send('<p>Your cart is empty.</p>');
  }

  const cartItemsHTML = req.session.cart.items
      .map(item => `
          <div class="cart-item">
              <p>${item.product.name} - $${item.product.price}</p>
              <p>Quantity: ${item.quantity}</p>
          </div>
      `)
      .join('');

  res.status(200).send(cartItemsHTML);
});

app.get("/home", async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
  const Cat = require("./models/category")  
  const pro = require("./models/products")
  let products = await pro.find()
  let category = await Cat.find()
  res.render("index" , {  layout : "layout" , category,products});
});




app.get("/adminpanel", async (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login');
    }
    res.render("home" , {  layout : "admin-layout"});
  });



