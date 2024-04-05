const Cart = require("../models/cart");

addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    // Calculate subtotal
    cart.subtotal = calculateSubtotal(cart.products);

    await cart.save();
    res.status(201).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (product) => product.productId !== productId
    );

    // Calculate subtotal
    cart.subTotal = calculateSubtotal(cart.products);

    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to calculate subtotal
const calculateSubtotal = (products) => {
  let subTotal = 0;
  products.forEach((product) => {
    // Calculate subtotal for each product (e.g., product price * quantity)
    subtotal += product.price * product.quantity;
  });
  return subTotal;
};

module.exports = {
  addToCart,
  removeFromCart,
};
