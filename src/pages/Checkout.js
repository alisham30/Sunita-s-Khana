import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Checkout.css';

const Checkout = () => {
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState({});
  
  const { currentUser } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if cart has items
    if (!cart || cart.length === 0) {
      // Redirect to cart if no items
      navigate('/cart');
      return;
    }
    
    // Pre-fill user data if available
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || ''
      }));
    }
    
    setLoading(false);
  }, [currentUser, navigate, cart]);

  // Calculate total price
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Check if user is authenticated
        if (!currentUser) {
          alert('Please log in to place an order.');
          navigate('/login');
          return;
        }

        // Check if cart has items
        if (!cart || cart.length === 0) {
          alert('Your cart is empty. Please add items before placing an order.');
          navigate('/order');
          return;
        }

        // Show placing order loading state
        setPlacingOrder(true);

        // Prepare order data
        const orderData = {
          user: {
            userId: currentUser.uid,
            name: formData.name,
            email: formData.email
          },
          items: cart.map(item => ({
            _id: item.id || item._id,
            name: item.title || item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || item.imageUrl
          })),
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pincode
          },
          paymentMethod: formData.paymentMethod,
          subtotal: subtotal,
          taxAmount: tax,
          deliveryFee: deliveryFee,
          totalAmount: total,
          isPaid: false,
          isDelivered: false,
          status: 'pending'
        };

        console.log('Placing order with data:', orderData);

        // Send order to backend
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        const responseData = await response.json();
        console.log('Order response:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to place order');
        }

        // Clear cart using CartContext
        clearCart();
        
        // Navigate to success page with order data
        navigate('/order-success', {
          state: {
            orderData: {
              orderId: responseData._id,
              ...orderData
            }
          }
        });
        
        console.log('Order placed successfully:', responseData._id);
      } catch (error) {
        console.error('Error placing order:', error);
        alert(`Failed to place order: ${error.message}. Please try again.`);
      } finally {
        setPlacingOrder(false);
      }
    }
  };

  // Go back to cart
  const goBackToCart = () => {
    navigate('/cart');
  };

  // Go to home after order
  const goToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return <div className="checkout-loading">Loading checkout...</div>;
  }

  return (
    <div className="checkout-page-container">
      <Navbar />
      
      {/* Placing Order Loading Overlay */}
      {placingOrder && (
        <div className="placing-order-overlay">
          <div className="placing-order-content">
            <div className="placing-order-animation">
              <div className="order-spinner"></div>
              <div className="cooking-animation">
                <span className="cooking-emoji">👨‍🍳</span>
                <span className="cooking-emoji">🍳</span>
                <span className="cooking-emoji">🔥</span>
              </div>
            </div>
            <h2>Placing Your Order...</h2>
            <p>Please wait while we prepare your delicious meal order</p>
            <div className="order-steps">
              <div className="step active">
                <i className="fas fa-check"></i>
                <span>Order Details Confirmed</span>
              </div>
              <div className="step active">
                <i className="fas fa-credit-card"></i>
                <span>Processing Payment</span>
              </div>
              <div className="step processing">
                <i className="fas fa-utensils"></i>
                <span>Sending to Kitchen</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Checkout Content */}
      <div className={placingOrder ? 'checkout-content-blurred' : ''}>
        <>
          <div className="checkout-header">
            <h1>Checkout</h1>
            <button className="back-to-cart-button" onClick={goBackToCart}>
              <i className="fas fa-arrow-left"></i> Back to Cart
            </button>
          </div>
          
          <div className="checkout-content">
            <div className="checkout-form-container">
              <form onSubmit={handleSubmit} className="checkout-form">
                <h2>Delivery Information</h2>
                
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  ></textarea>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>
                
                <h2>Payment Method</h2>
                
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cash">
                      <i className="fas fa-money-bill-wave"></i>
                      Cash on Delivery
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="card">
                      <i className="fas fa-credit-card"></i>
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="upi">
                      <i className="fas fa-mobile-alt"></i>
                      UPI
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod !== 'cash' && (
                  <div className="payment-note">
                    <p>
                      <i className="fas fa-info-circle"></i>
                      Payment details will be collected on the next screen.
                    </p>
                  </div>
                )}
                
                <button type="submit" className="place-order-button">
                  Place Order
                </button>
              </form>
            </div>
            
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cart.map(item => (
                  <div className="order-item" key={item.id}>
                    <div className="item-info">
                      <img src={item.image} alt={item.title} />
                      <div>
                        <h3>{item.title}</h3>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="item-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              <div className="price-details">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                <div className="price-row">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                
                <div className="price-row">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                
                <div className="price-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
