import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipeById } from '../services/recipeService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const data = await getRecipeById(id);
        if (!data) {
          throw new Error('Recipe not found');
        }
        
        // Calculate price based on recipe complexity
        const price = calculatePrice(data.totalTimeInMins, data.ingredientCount);
        
        setRecipe({
          ...data,
          price
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError('Failed to load recipe details. Please try again.');
        setLoading(false);
      }
    };

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchRecipe();
  }, [id]);

  // Calculate a price based on recipe complexity
  const calculatePrice = (cookingTime, ingredientCount) => {
    const basePrice = 150; // Base price in rupees
    const timeMultiplier = cookingTime ? cookingTime / 30 : 1; // Longer cooking time = higher price
    const ingredientMultiplier = ingredientCount ? ingredientCount / 10 : 1; // More ingredients = higher price
    
    return Math.round((basePrice * timeMultiplier * ingredientMultiplier) / 10) * 10; // Round to nearest 10 rupees
  };

  // Add item to cart
  const addToCart = () => {
    if (!recipe) return;
    
    const recipeForCart = {
      id: recipe._id,
      title: recipe.translatedRecipeName,
      description: recipe.cleanedIngredients ? 
        `${recipe.cuisine} dish with ${recipe.ingredientCount} ingredients. Ready in ${recipe.totalTimeInMins} mins.` : 
        `${recipe.cuisine} dish ready in ${recipe.totalTimeInMins} minutes.`,
      image: recipe.imageUrl || "/images/default-recipe.jpg",
      price: recipe.price
    };
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(item => item.id === recipeForCart.id);
      
      let newCart;
      if (existingItem) {
        // Increase quantity if item exists
        newCart = prevCart.map(item => 
          item.id === recipeForCart.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        newCart = [...prevCart, { ...recipeForCart, quantity: 1 }];
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    
    // Show success message
    alert(`${recipe.translatedRecipeName} added to cart!`);
  };

  const goBack = () => {
    navigate('/home');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  if (!recipe) return <ErrorMessage message="Recipe not found" onRetry={() => navigate('/home')} />;

  // Format ingredients as a list
  const ingredients = recipe.cleanedIngredients 
    ? recipe.cleanedIngredients.split(',').map(item => item.trim())
    : recipe.translatedIngredients
      ? recipe.translatedIngredients.split(',').map(item => item.trim())
      : [];

  // Format instructions as steps
  const instructions = recipe.translatedInstructions
    ? recipe.translatedInstructions.split('.')
      .filter(step => step.trim().length > 0)
      .map(step => step.trim())
    : [];

  return (
    <div className="recipe-detail-container">
      <Navbar />
      
      <div className="recipe-detail-header">
        <button className="back-button" onClick={goBack}>
          <i className="fas fa-arrow-left"></i> Back to Recipes
        </button>
        
        <div className="cart-summary">
          <Link to="/cart" className="cart-link">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
          </Link>
        </div>
      </div>
      
      <div className="recipe-detail-content">
        <div className="recipe-detail-left">
          <img 
            src={recipe.imageUrl || "/images/default-recipe.jpg"} 
            alt={recipe.translatedRecipeName} 
            className="recipe-detail-image" 
          />
          
          <div className="recipe-order-section">
            <div className="recipe-price">₹{recipe.price}</div>
            <button className="add-to-cart-button" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </div>
        
        <div className="recipe-detail-right">
          <h1 className="recipe-title">{recipe.translatedRecipeName}</h1>
          
          <div className="recipe-meta">
            <div className="meta-item">
              <i className="fas fa-utensils"></i>
              <span>{recipe.cuisine || 'Indian'} Cuisine</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-clock"></i>
              <span>{recipe.totalTimeInMins || '30'} mins</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-list"></i>
              <span>{recipe.ingredientCount || ingredients.length} ingredients</span>
            </div>
          </div>
          
          <div className="recipe-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))
              ) : (
                <li>Ingredients information not available</li>
              )}
            </ul>
          </div>
          
          <div className="recipe-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {instructions.length > 0 ? (
                instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))
              ) : (
                <li>Instructions information not available</li>
              )}
            </ol>
          </div>
          
          {recipe.url && (
            <div className="recipe-section">
              <h2>Source</h2>
              <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="recipe-source-link">
                View Original Recipe
              </a>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
