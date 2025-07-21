const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// @route   POST api/carts
// @desc    Create or update a user's cart
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items) {
      return res.status(400).json({ message: 'User ID and items are required' });
    }

    // Check if cart exists for this user
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Update existing cart
      cart.items = items;
      // Subtotal will be calculated in pre-save hook
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        items
        // Subtotal will be calculated in pre-save hook
      });
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/carts/:userId
// @desc    Get a user's cart
// @access  Private
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/carts/:userId/add
// @desc    Add item to cart
// @access  Private
router.put('/:userId/add', async (req, res) => {
  try {
    const { item } = req.body;
    
    if (!item || !item._id) {
      return res.status(400).json({ message: 'Valid item data is required' });
    }
    
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId: req.params.userId,
        items: [item]
      });
    } else {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(i => i._id === item._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += item.quantity || 1;
      } else {
        // Add new item
        cart.items.push(item);
      }
    }
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/carts/:userId/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/:userId/update', async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Item ID and valid quantity are required' });
    }
    
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/carts/:userId/remove
// @desc    Remove item from cart
// @access  Private
router.put('/:userId/remove', async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    // Remove the item from the cart
    cart.items = cart.items.filter(item => item._id !== itemId);
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/carts/:userId/clear
// @desc    Clear user's cart
// @access  Private
router.delete('/:userId/clear', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    // Clear all items
    cart.items = [];
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/carts/:userId/item/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:userId/item/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    cart.items = cart.items.filter(item => item._id !== req.params.itemId);
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE api/carts/:userId
// @desc    Clear cart
// @access  Private
router.delete('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    
    cart.items = [];
    
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
