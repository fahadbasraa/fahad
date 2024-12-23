
const express = require("express");
const router = express.Router();
const Product = require("../../models/products");
const Category = require("../../models/category");
const multer = require("multer");
const authorized = require("../../middlewares/authorize")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });

router.get('/products', async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
  try {
    const { search = '', minPrice = 0, sortBy = 'name', sortOrder = 'asc', page = 1 } = req.query;

    // Build query filter object
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (minPrice) {
      filter.price = { $gte: minPrice };
    }

    // Sorting logic
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1; // Sorting by specified field in ascending or descending order
    }

    // Pagination setup
    const limit = 3; // Products per page
    const skip = (page - 1) * limit;

    // Fetch products with filters, sorting, and pagination
    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('productList', {
      products,
      searchQuery: search,
      minPrice,
      sortBy,
      sortOrder,
      page,
      totalPages,
      layout: "admin-layout",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
});

router.get("/products/create", async (req, res) => {
  if (!req.session.user_id) {
     res.redirect("/login"); // Use return to stop further execution
  }
  // if (req.session.user.role !== "admin") {
  //   return res.status(403).render("error", {
  //     message: "You can't perform this action.",
  //     layout: "admin-layout",
  //   });
  // }
  const categories = await Category.find();
  res.render("createProd", { categories, layout: "admin-layout" });
});
// Create a new product
router.post("/products/create", upload.single("file"), async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    picture: req.file ? req.file.filename : null,
  });

  await newProduct.save();

  if (req.xhr) {
    // If the request is AJAX, return the product data as JSON
    res.status(201).json(newProduct);
  } else {
    // Otherwise, redirect as usual
    res.redirect("/products");
  }
});

router.get("/api/products", async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
  // if (!req.session.user.role !== "admin") {
  //   // Render a message for unauthorized users
  //   return res.status(403).render("error", {
  //     message: "You can't perform this action.",
  //     layout: "admin-layout",
  //   });
  // }
  const products = await Product.find().populate("category", "name");
  res.json(products);
});



// Show the form to edit a product
router.get("/products/edit/:id" , async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
  // if (!req.session.user.role !== "admin") {
  //   // Render a message for unauthorized users
  //   return res.status(403).render("error", {
  //     message: "You can't perform this action.",
  //     layout: "admin-layout",
  //   });
  // }
  const product = await Product.findById(req.params.id).populate("category", "name");
  const categories = await Category.find();
  res.render("editProduct", { product, categories, layout: "admin-layout" });
});

// Edit a product
router.post("/products/edit/:id" , upload.single("file"), async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      category,
      stock,
      picture: req.file ? req.file.filename : null,
    },
    { new: true }
  );

  res.redirect("/products");
});

// Delete a product
router.get("/products/delete/:id" , async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
    // if (req.session.user.role !== "admin") {
    //   // Render a message for unauthorized users
    //   return res.status(403).render("error", {
    //     message: "You can't perform this action.",
    //     layout: "admin-layout",
    //   });
    // }
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

module.exports = router;
