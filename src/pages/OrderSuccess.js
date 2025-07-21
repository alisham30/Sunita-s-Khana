import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/OrderSuccess.css';

const OrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Get order details from navigation state
    const orderData = location.state?.orderData;
    
    if (!orderData) {
      // If no order data, redirect to home
      navigate('/home');
      return;
    }

    setOrderDetails(orderData);
    
    // Calculate estimated delivery time (30-45 minutes from now)
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (35 * 60 * 1000)); // 35 minutes
    setEstimatedDelivery(deliveryTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));

    // Auto-redirect to My Orders after 10 seconds
    const timer = setTimeout(() => {
      navigate('/my-orders');
    }, 10000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleContinueShopping = () => {
    navigate('/order');
  };

  const handleViewOrders = () => {
    navigate('/my-orders');
  };

  const handleTrackOrder = () => {
    // For now, redirect to My Orders
    // In future, could implement real-time order tracking
    navigate('/my-orders');
  };

  if (!orderDetails) {
    return (
      <div className="order-success-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <Navbar />
      
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
          <div className="confetti">
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-message">
          <h1>🎉 Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Thank you for choosing Sunita's Khana, {currentUser?.displayName || 'valued customer'}!
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="order-header">
            <div className="order-id">
              <span className="label">Order ID:</span>
              <span className="value">#{orderDetails.orderId}</span>
            </div>
            <div className="order-status">
              <span className="status-badge confirmed">Confirmed</span>
            </div>
          </div>

          <div className="delivery-info">
            <div className="delivery-time">
              <div className="icon">🕒</div>
              <div className="info">
                <h3>Estimated Delivery</h3>
                <p className="time">{estimatedDelivery}</p>
                <p className="date">Today</p>
              </div>
            </div>
            
            <div className="delivery-address">
              <div className="icon">📍</div>
              <div className="info">
                <h3>Delivery Address</h3>
                <p>{orderDetails.shippingAddress.street}</p>
                <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          <div className="order-items">
            <h3>Your Order</h3>
            <div className="items-list">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="payment-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{orderDetails.taxAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{orderDetails.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Paid:</span>
              <span>₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-method">
            <div className="icon">💳</div>
            <div className="info">
              <h3>Payment Method</h3>
              <p>{orderDetails.paymentMethod.toUpperCase()}</p>
              <span className="payment-status">
                {orderDetails.paymentMethod === 'cash' ? 'Pay on Delivery' : 'Payment Confirmed'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="track-order-btn" onClick={handleTrackOrder}>
            <i className="fas fa-map-marker-alt"></i>
            Track Your Order
          </button>
          <button className="view-orders-btn" onClick={handleViewOrders}>
            <i className="fas fa-list"></i>
            View All Orders
          </button>
          <button className="continue-shopping-btn" onClick={handleContinueShopping}>
            <i className="fas fa-shopping-bag"></i>
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">📧</div>
              <h3>Email Confirmation</h3>
              <p>Order confirmation sent to {currentUser?.email}</p>
            </div>
            <div className="info-card">
              <div className="card-icon">📱</div>
              <h3>Order Updates</h3>
              <p>We'll send SMS updates about your order status</p>
            </div>
            <div className="info-card">
              <div className="card-icon">🍽️</div>
              <h3>Fresh & Hot</h3>
              <p>Your food will be prepared fresh and delivered hot</p>
            </div>
          </div>
        </div>

        {/* Auto-redirect Notice */}
        <div className="auto-redirect-notice">
          <p>
            <i className="fas fa-info-circle"></i>
            You'll be redirected to your orders page in a few seconds...
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
