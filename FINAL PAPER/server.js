const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")
// Adjust the path accordingly
const Cat = require("./models/category")  
const pro = require("./models/products")



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

  app.get("/home",(req,res)=>{
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

app.get("/", async (req, res) => {
  const user = req.session.user || null;
  
  let products = await pro.find()
  let category = await Cat.find()
  res.render("index" , {  layout : "layout" , category,products,user});
});
app.post('/wishlist/add/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Simulate an error by checking for a specific invalid ID (for testing)
    if (id === "invalid_id") {
      throw new Error("Simulated error for testing");
    }

    // Find the product by the provided ID
    const product = await pro.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get the wishlist from session or initialize if not present
    const wishlist = req.session.wishlist || [];

    // Add the product to the wishlist if not already present
    if (!wishlist.some(item => item._id.equals(product._id))) {
      wishlist.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || 'default.jpg',
      });
    }

    // Save the updated wishlist back to session
    req.session.wishlist = wishlist;

    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error.message); // Log the error for debugging
    res.status(500).json({ message: 'Error adding product to wishlist' });
  }
});

app.get('/wishlist/add/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await pro.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const wishlist = req.session.wishlist || [];

    if (!wishlist.some(item => item._id.equals(product._id))) {
      wishlist.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || 'default.jpg',
      });
    }

    req.session.wishlist = wishlist;
    res.render('wishlist', { 
      wishlistItems: wishlist, // Wishlist items stored in the session
      title: 'Your Wishlist'  // Page title
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error.message);
    res.status(500).json({ message: 'Error adding product to wishlist' });
  }
});



// Route to view the wishlist
app.get('/wishlist', async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if the user is not logged in
    }

    // Retrieve the wishlist from the session
    const wishlist = req.session.wishlist || [];

    // Render the wishlist page with the wishlist items
    res.render('wishlist', { 
      wishlistItems: wishlist, // Wishlist items stored in the session
      title: 'Your Wishlist'  // Page title
    });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).send('Error fetching wishlist.');
  }
});


app.get("/adminpanel", async (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login');
    }
    res.render("home" , {  layout : "admin-layout"});
  });



