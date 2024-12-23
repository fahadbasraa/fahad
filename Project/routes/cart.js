const express = require('express');
const router = express.Router();
const Product = require('../models/products'); // Assuming you have a Product model

// Add product to cart
router.post('/add', async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Initialize cart if not present in session
        if (!req.session.cart) {
            req.session.cart = { items: [] };
        }

        const cart = req.session.cart;

        const existingItem = cart.items.find(item => item.product._id.toString() === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                },
                quantity: 1,
            });
        }


        req.session.cart = cart;
        const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        // Render the cart with updated items
        res.status(200).render('addToCart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to add product to cart' });
    }
});

module.exports = router;
