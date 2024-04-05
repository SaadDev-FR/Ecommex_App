const express = require("express");
const router = express.Router();
const { addToCart, getCartProducts } = require("../controllers/cartController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Add routes for cart operations
router.post("/add-to-cart", authenticateUser, addToCart);
router.get("/cart-products", authenticateUser, getCartProducts);

module.exports = router;
