import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import OrderPage from "./pages/OrderPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Recipes from "./pages/Recipes";
import Products from "./pages/Products";
import MyOrders from "./pages/MyOrders";
import "./styles/App.css";
import "./styles/Navbar.css";
import "./styles/Carousel.css";
import "./styles/Card.css";
import "./styles/Footer.css";
import "./styles/LoadingSpinner.css";
import "./styles/ErrorMessage.css";
import "./styles/Landing.css";
import "./styles/Home.css";
import "./styles/RecipeDetail.css";
import "./styles/Cart.css";
import "./styles/Checkout.css";
import "./styles/About.css";
import "./styles/ProductCard.css";
import "./styles/Recipes.css";
import "./styles/Products.css";
import "./styles/MyOrders.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/recipe/:id" element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/order" element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          
          <Route path="/about" element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } />
          
          <Route path="/recipes" element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          
          {/* Redirect all unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
