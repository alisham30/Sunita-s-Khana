import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ChatBot from "../components/ChatBot";
import FoodRecommendations from "../components/FoodRecommendations";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import { getAllRecipes } from "../services/recipeService";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Home.css";

// Fallback data in case API is not available
const fallbackData = [
  { id: 1, title: "Paneer Butter Masala", description: "Rich and creamy paneer butter masala cooked with love.", image: "/images/paneerbutter.png" },
  { id: 2, title: "Aloo Paratha", description: "Soft and stuffed Aloo Paratha served with fresh curd and pickles.", image: "/images/aloo.jpeg" },
  { id: 3, title: "Rajma Chawal", description: "Perfectly spiced Rajma with hot steamed rice, a true comfort meal.", image: "/images/rajma.jpeg" },
  { id: 4, title: "Butter Chicken", description: "Authentic butter chicken with creamy tomato-based gravy.", image: "/images/butterchicken.jpeg" },
  { id: 5, title: "Mangalorean Fish Curry", description: "Spicy and tangy fish curry, a Mangalorean delicacy.", image: "/images/fishcurry.jpeg" },
  { id: 6, title: "Neer Dosa", description: "Soft and delicate Mangalorean rice crepes.", image: "/images/neerdosa.jpeg" },
];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching recipes from API...');
      const data = await getAllRecipes();
      console.log('API response received:', data);
      
      if (!data || data.length === 0) {
        console.warn('API returned empty data');
        throw new Error('No recipes found');
      }
      
      // Transform the data to match our Card component props
      const formattedRecipes = data.map(recipe => ({
        id: recipe._id,
        title: recipe.translatedRecipeName,
        description: recipe.cleanedIngredients ? 
          `${recipe.cuisine} dish with ${recipe.ingredientCount} ingredients. Ready in ${recipe.totalTimeInMins} mins.` : 
          `${recipe.cuisine} dish ready in ${recipe.totalTimeInMins} minutes.`,
        image: recipe.imageUrl || "/images/default-recipe.jpg", // Fallback image if none provided
        fullRecipe: recipe, // Store the full recipe data for potential detailed view
        price: calculatePrice(recipe.totalTimeInMins, recipe.ingredientCount), // Calculate a price based on complexity
        cuisine: recipe.cuisine
      }));
      
      console.log('Formatted recipes:', formattedRecipes.length);
      setRecipes(formattedRecipes);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes from the server. Please try again.');
      setRecipes(fallbackData); // Use fallback data if API fails
      setLoading(false);
    }
  };

  // Calculate a price based on recipe complexity
  const calculatePrice = (cookingTime, ingredientCount) => {
    const basePrice = 150; // Base price in rupees
    const timeMultiplier = cookingTime ? cookingTime / 30 : 1; // Longer cooking time = higher price
    const ingredientMultiplier = ingredientCount ? ingredientCount / 10 : 1; // More ingredients = higher price
    
    return Math.round((basePrice * timeMultiplier * ingredientMultiplier) / 10) * 10; // Round to nearest 10 rupees
  };

  // Add item to cart
  const addToCart = (recipe) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(item => item.id === recipe.id);
      
      if (existingItem) {
        // Increase quantity if item exists
        return prevCart.map(item => 
          item.id === recipe.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...recipe, quantity: 1 }];
      }
    });
    
    // Show success message or notification
    alert(`${recipe.title} added to cart!`);
  };

  // View recipe details
  const viewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Filter recipes based on search term and cuisine
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter ? recipe.cuisine === cuisineFilter : true;
    return matchesSearch && matchesCuisine;
  });

  // Get unique cuisines for filter dropdown
  const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))].filter(Boolean);

  useEffect(() => {
    fetchRecipes();
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* User controls removed as requested */}
      
      <Carousel />
      
      {/* Personalized Recommendations Section */}
      <PersonalizedRecommendations recipes={recipes} />
      
      {/* Food Recommendations Section */}
      <FoodRecommendations recipes={recipes} />
      
      <div className="search-filter-container">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="cuisine-filter">
          <select 
            value={cuisineFilter} 
            onChange={(e) => setCuisineFilter(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchRecipes} />
      ) : (
        <div className="recipes-container">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div className="recipe-card" key={recipe.id}>
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                </div>
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <p className="recipe-price">₹{recipe.price}</p>
                  <div className="recipe-actions">
                    <button 
                      className="view-recipe-button" 
                      onClick={() => viewRecipe(recipe.id)}
                    >
                      View Recipe
                    </button>
                    <button 
                      className="add-to-cart-button" 
                      onClick={() => addToCart(recipe)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-recipes">No recipes found matching your search criteria.</div>
          )}
        </div>
      )}
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Home;
