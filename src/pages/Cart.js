import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Cart.css';

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Go back to shopping
  const continueShopping = () => {
    navigate('/order');
  };

  // Proceed to checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page-container">
      <Navbar />
      
      <div className="cart-header">
        <h1>Your Cart</h1>
        <button className="continue-shopping-button" onClick={continueShopping}>
          <i className="fas fa-arrow-left"></i> Continue Shopping
        </button>
      </div>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="browse-recipes-button" onClick={continueShopping}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span className="header-item">Item</span>
              <span className="header-price">Price</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-total">Total</span>
              <span className="header-actions">Actions</span>
            </div>
            
            {cart.map(item => (
              <div className="cart-item" key={item._id}>
                <div className="item-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
                
                <div className="item-price">₹{item.price}</div>
                
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                
                <div className="item-total">₹{item.price * item.quantity}</div>
                
                <div className="item-actions">
                  <button onClick={() => removeFromCart(item._id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Items ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹50</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{Math.round(cartTotal * 0.05)}</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal + 50 + Math.round(cartTotal * 0.05)}</span>
            </div>
            
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            <button className="clear-cart-button" onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}>
              Clear Cart
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Cart;
