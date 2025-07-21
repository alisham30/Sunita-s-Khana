import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes } from '../services/recipeService';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/OrderPage.css';

const OrderPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    cuisine: '',
    priceRange: '',
    sortBy: 'popularity'
  });
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getAllRecipes();
        
        if (!data || data.length === 0) {
          throw new Error('No recipes found');
        }
        
        // Transform the data for display
        const formattedRecipes = data.map(recipe => ({
          id: recipe._id,
          title: recipe.translatedRecipeName,
          description: recipe.cleanedIngredients ? 
            `${recipe.cuisine} dish with ${recipe.ingredientCount} ingredients. Ready in ${recipe.totalTimeInMins} mins.` : 
            `${recipe.cuisine} dish ready in ${recipe.totalTimeInMins} minutes.`,
          image: recipe.imageUrl || "/images/default-recipe.jpg",
          price: calculatePrice(recipe.totalTimeInMins, recipe.ingredientCount),
          cuisine: recipe.cuisine,
          cookingTime: recipe.totalTimeInMins || 30,
          popularity: Math.floor(Math.random() * 100) // Simulated popularity score
        }));
        
        setRecipes(formattedRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again.');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Calculate price based on recipe complexity
  const calculatePrice = (cookingTime, ingredientCount) => {
    const basePrice = 150; // Base price in rupees
    const timeMultiplier = cookingTime ? cookingTime / 30 : 1;
    const ingredientMultiplier = ingredientCount ? ingredientCount / 10 : 1;
    
    return Math.round((basePrice * timeMultiplier * ingredientMultiplier) / 10) * 10;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add item to cart
  const handleAddToCart = (recipe) => {
    // Convert recipe format to match CartContext expected format
    const cartItem = {
      _id: recipe.id,  // Make sure we use _id as the identifier
      name: recipe.title,
      price: recipe.price,
      image: recipe.image,
      description: recipe.description
    };
    
    // Use CartContext addToCart function
    addToCart(cartItem);
    
    // Show notification
    alert(`${recipe.title} added to cart!`);
  };

  // View recipe details
  const viewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Go to cart
  const goToCart = () => {
    navigate('/cart');
  };

  // Filter and sort recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesCuisine = filters.cuisine ? recipe.cuisine === filters.cuisine : true;
    
    let matchesPriceRange = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      matchesPriceRange = recipe.price >= min && recipe.price <= max;
    }
    
    return matchesSearch && matchesCuisine && matchesPriceRange;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'time':
        return a.cookingTime - b.cookingTime;
      case 'popularity':
      default:
        return b.popularity - a.popularity;
    }
  });

  // Get unique cuisines for filter dropdown
  const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))].filter(Boolean);

  return (
    <div className="order-page">
      <Navbar />
      
      {/* Header removed as requested */}
      
      <div className="order-container">
        <div className="filters-sidebar">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <label htmlFor="searchTerm">Search</label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search recipes..."
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="cuisine">Cuisine</label>
            <select
              id="cuisine"
              name="cuisine"
              value={filters.cuisine}
              onChange={handleFilterChange}
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="priceRange">Price Range</label>
            <select
              id="priceRange"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">All Prices</option>
              <option value="100-200">₹100 - ₹200</option>
              <option value="200-300">₹200 - ₹300</option>
              <option value="300-400">₹300 - ₹400</option>
              <option value="400-500">₹400 - ₹500</option>
              <option value="500-1000">₹500+</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="time">Cooking Time</option>
            </select>
          </div>
        </div>
        
        <div className="recipes-grid">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : sortedRecipes.length === 0 ? (
            <div className="no-recipes">
              <p>No recipes found matching your criteria.</p>
            </div>
          ) : (
            sortedRecipes.map(recipe => (
              <div className="recipe-card" key={recipe.id}>
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className="recipe-content">
                  <h3>{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <div className="recipe-meta">
                    <span className="recipe-cuisine">{recipe.cuisine}</span>
                    <span className="recipe-time">{recipe.cookingTime} mins</span>
                  </div>
                  <div className="recipe-price">₹{recipe.price}</div>
                  <div className="recipe-actions">
                    <button 
                      className="view-recipe-btn"
                      onClick={() => viewRecipe(recipe.id)}
                    >
                      View Recipe
                    </button>
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(recipe)}>
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderPage;
