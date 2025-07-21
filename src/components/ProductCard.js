import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ recipe }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Calculate price based on cooking time and ingredients (simple algorithm)
  const calculatePrice = () => {
    const basePrice = 100; // Base price in rupees
    const timeMultiplier = recipe.totalTimeInMins > 60 ? 1.5 : 1;
    const ingredientMultiplier = recipe.ingredientCount > 8 ? 1.3 : 1;
    return Math.round(basePrice * timeMultiplier * ingredientMultiplier);
  };

  const price = calculatePrice();

  const handleViewRecipe = () => {
    navigate(`/recipe/${recipe._id}`, { state: { recipe } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...recipe,
      price,
      quantity: 1
    });
  };

  return (
    <div className="product-card" onClick={handleViewRecipe}>
      <div className="product-image-container">
        <img 
          src={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=Delicious+Indian+Food'} 
          alt={recipe.translatedRecipeName} 
          className="product-image"
        />
        <div className="cuisine-tag">{recipe.cuisine}</div>
      </div>
      <div className="product-info">
        <h3 className="product-title">{recipe.translatedRecipeName}</h3>
        <div className="product-meta">
          <span className="cooking-time">
            <i className="fas fa-clock"></i> {recipe.totalTimeInMins} mins
          </span>
          <span className="ingredient-count">
            <i className="fas fa-mortar-pestle"></i> {recipe.ingredientCount} ingredients
          </span>
        </div>
        <p className="product-price">₹{price}</p>
        <div className="product-actions">
          <button className="view-recipe-btn" onClick={handleViewRecipe}>
            View Recipe
          </button>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
