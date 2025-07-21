const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      deliveryFee,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!user || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new order
    const newOrder = new Order({
      user,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      deliveryFee,
      totalAmount,
      isPaid: false,
      isDelivered: false,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/orders/user/:userId
// @desc    Get all orders for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('Fetching orders for user ID:', req.params.userId);
    
    const orders = await Order.find({ 'user.userId': req.params.userId })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for user`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      emailAddress: req.body.emailAddress
    };
    order.status = 'processing';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private (Admin)
router.put('/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order delivery:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Please provide a valid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    // Update related fields based on status
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
