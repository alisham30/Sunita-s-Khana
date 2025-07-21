import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Load cart from backend or localStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        // If user is logged in, try to fetch cart from backend
        if (currentUser) {
          const response = await fetch(`http://localhost:5000/api/carts/${currentUser.uid}`);
          
          if (response.ok) {
            const data = await response.json();
            setCart(data.items || []);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to localStorage if backend fetch fails or user is not logged in
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [currentUser]);

  // Update cart in backend and localStorage whenever cart changes
  useEffect(() => {
    // Always update localStorage as fallback
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    // Update cart in backend if user is logged in
    const updateBackendCart = async () => {
      if (currentUser && cart.length > 0) {
        try {
          await fetch('http://localhost:5000/api/carts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: currentUser.uid,
              items: cart
            })
          });
        } catch (error) {
          console.error('Error updating cart in backend:', error);
        }
      }
    };
    
    updateBackendCart();
  }, [cart, currentUser]);

  // Add item to cart
  const addToCart = async (item) => {
    // First update local state for immediate UI feedback
    setCart(prevCart => {
      // Check if item already exists in cart - handle both id and _id properties
      const itemId = item.id || item._id;
      const existingItemIndex = prevCart.findIndex(cartItem => {
        const cartItemId = cartItem.id || cartItem._id;
        return cartItemId === itemId;
      });
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    // Then update backend if user is logged in
    if (currentUser) {
      try {
        const itemToAdd = {
          _id: item.id || item._id,
          name: item.title || item.name,
          price: item.price,
          quantity: 1,
          image: item.image || item.imageUrl,
          description: item.description || ''
        };
        
        await fetch(`http://localhost:5000/api/carts/${currentUser.uid}/add`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ item: itemToAdd })
        });
      } catch (error) {
        console.error('Error adding item to cart in backend:', error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    // First update local state for immediate UI feedback
    setCart(prevCart => prevCart.filter(item => {
      const cartItemId = item.id || item._id;
      return cartItemId !== itemId;
    }));
    
    // Then update backend if user is logged in
    if (currentUser) {
      try {
        await fetch(`http://localhost:5000/api/carts/${currentUser.uid}/remove`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemId })
        });
      } catch (error) {
        console.error('Error removing item from cart in backend:', error);
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    // First update local state for immediate UI feedback
    setCart(prevCart => {
      return prevCart.map(item => {
        const cartItemId = item.id || item._id;
        if (cartItemId === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
    
    // Then update backend if user is logged in
    if (currentUser) {
      try {
        await fetch(`http://localhost:5000/api/carts/${currentUser.uid}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemId, quantity })
        });
      } catch (error) {
        console.error('Error updating item quantity in backend:', error);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    // First update local state for immediate UI feedback
    setCart([]);
    localStorage.removeItem('cart');
    
    // Then update backend if user is logged in
    if (currentUser) {
      try {
        await fetch(`http://localhost:5000/api/carts/${currentUser.uid}/clear`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error clearing cart in backend:', error);
      }
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
