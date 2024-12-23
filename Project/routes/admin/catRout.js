const express = require("express");
const router = express.Router();
const Category = require("../../models/category");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads"); // Directory to store files
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
  });
  const upload = multer({ storage: storage });


  router.get("/categories", async (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login');
    }
    let page = parseInt(req.query.page) || 1; // Default to page 1
    let pageSize = 2; // Number of categories per page
  
    let searchQuery = req.query.search || ""; // Search query (if any)
  
    // Build the filter
    let filter = {};
  
    if (searchQuery) {
      filter.name = { $regex: searchQuery, $options: "i" }; // Search by category name (case-insensitive)
    }
  
    // Find categories with pagination and filtering
    const categories = await Category.find(filter)
      .limit(pageSize)
      .skip((page - 1) * pageSize);
  
    // Get the total number of categories matching the filter
    const totalRecords = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);
  
    // Render the category list with pagination, search, and filter data
    res.render("category", {
      categories,
      searchQuery,
      page,
      totalPages,
      totalRecords,
      layout: "admin-layout",
    });
  });
  


  router.get("/categories/create", (req, res) => {
    if (!req.session.user_id){
      res.redirect('/login');
    }
 
    res.render("createCat", { layout: "admin-layout" });
  });
  


router.post("/categories/create",   upload.single("file"), async (req, res) => {
  
    const newCategory = new Category({
        name : req.body.name,
        picture: req.file ? req.file.filename : null,
    });
    await newCategory.save();
    res.redirect("/categories");
  
});


router.get("/categories/edit/:id",  async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
    const category = await Category.findById(req.params.id);
   
    res.render("editCat", { category, layout : "admin-layout" });
  
});


router.post("/categories/edit/:id",  async (req, res) => {
  
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/categories");
  
});


router.get("/categories/delete/:id",  async (req, res) => {
  if (!req.session.user_id){
    res.redirect('/login');
  }
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/categories");
 
  
});

module.exports = router;
