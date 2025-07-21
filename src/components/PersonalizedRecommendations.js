import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../styles/PersonalizedRecommendations.css';

const PersonalizedRecommendations = ({ recipes = [] }) => {
  const [userPreferences, setUserPreferences] = useState({});
  const [personalizedSections, setPersonalizedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && recipes.length > 0) {
      loadUserPreferences();
    }
  }, [currentUser, recipes]);

  const loadUserPreferences = async () => {
    try {
      setLoading(true);
      
      // Try to load user preferences from backend
      let preferences = {};
      if (currentUser) {
        try {
          const response = await fetch(`http://localhost:5000/api/user-preferences/${currentUser.uid}`);
          if (response.ok) {
            preferences = await response.json();
          }
        } catch (error) {
          console.log('Backend preferences not available, using localStorage');
        }
      }
      
      // Fallback to localStorage
      const localPreferences = localStorage.getItem(`userPreferences_${currentUser?.uid || 'guest'}`);
      if (localPreferences) {
        preferences = { ...preferences, ...JSON.parse(localPreferences) };
      }
      
      // Initialize default preferences if none exist
      if (Object.keys(preferences).length === 0) {
        preferences = initializeDefaultPreferences();
      }
      
      setUserPreferences(preferences);
      generatePersonalizedRecommendations(preferences);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      const defaultPrefs = initializeDefaultPreferences();
      setUserPreferences(defaultPrefs);
      generatePersonalizedRecommendations(defaultPrefs);
      setLoading(false);
    }
  };

  const initializeDefaultPreferences = () => {
    return {
      favoriteRecipes: [],
      favoriteCuisines: [],
      orderHistory: [],
      dietaryPreferences: [],
      spiceLevel: 'medium',
      preferredMealTimes: [],
      lastViewedRecipes: [],
      searchHistory: [],
      priceRange: 'medium',
      cookingTimePreference: 'medium'
    };
  };

  const generatePersonalizedRecommendations = (preferences) => {
    const sections = [];
    
    // 1. Based on Order History
    if (preferences.orderHistory && preferences.orderHistory.length > 0) {
      const frequentlyOrderedCuisines = getFrequentCuisines(preferences.orderHistory);
      const similarRecipes = findSimilarRecipes(frequentlyOrderedCuisines);
      
      if (similarRecipes.length > 0) {
        sections.push({
          title: "🔄 Order Again",
          subtitle: `Based on your ${preferences.orderHistory.length} previous orders`,
          description: "Dishes similar to what you love ordering",
          recipes: similarRecipes.slice(0, 4),
          icon: "🔄",
          priority: 1
        });
      }
    }

    // 2. Based on Favorite Cuisines
    if (preferences.favoriteCuisines && preferences.favoriteCuisines.length > 0) {
      const cuisineBasedRecipes = recipes.filter(recipe => 
        preferences.favoriteCuisines.includes(recipe.cuisine)
      );
      
      if (cuisineBasedRecipes.length > 0) {
        sections.push({
          title: "❤️ Your Favorite Cuisines",
          subtitle: `${preferences.favoriteCuisines.join(', ')} dishes`,
          description: "More from the cuisines you love most",
          recipes: cuisineBasedRecipes.slice(0, 4),
          icon: "❤️",
          priority: 2
        });
      }
    }

    // 3. Based on Price Preference
    const priceBasedRecipes = filterByPricePreference(recipes, preferences.priceRange);
    if (priceBasedRecipes.length > 0) {
      sections.push({
        title: "💰 Perfect for Your Budget",
        subtitle: `${preferences.priceRange} price range`,
        description: "Great value dishes that fit your budget",
        recipes: priceBasedRecipes.slice(0, 4),
        icon: "💰",
        priority: 3
      });
    }

    // 4. Based on Dietary Preferences
    if (preferences.dietaryPreferences && preferences.dietaryPreferences.length > 0) {
      const dietaryRecipes = filterByDietaryPreferences(recipes, preferences.dietaryPreferences);
      if (dietaryRecipes.length > 0) {
        sections.push({
          title: "🥗 Just Right for You",
          subtitle: `${preferences.dietaryPreferences.join(', ')} options`,
          description: "Dishes that match your dietary preferences",
          recipes: dietaryRecipes.slice(0, 4),
          icon: "🥗",
          priority: 4
        });
      }
    }

    // 5. Based on Recently Viewed
    if (preferences.lastViewedRecipes && preferences.lastViewedRecipes.length > 0) {
      const recentlyViewedIds = preferences.lastViewedRecipes.slice(-10);
      const similarToViewed = findSimilarToViewed(recentlyViewedIds);
      
      if (similarToViewed.length > 0) {
        sections.push({
          title: "👀 You Might Also Like",
          subtitle: "Based on what you've been browsing",
          description: "Similar to dishes you recently viewed",
          recipes: similarToViewed.slice(0, 4),
          icon: "👀",
          priority: 5
        });
      }
    }

    // 6. Trending with Similar Users
    const trendingRecipes = getTrendingForSimilarUsers(preferences);
    if (trendingRecipes.length > 0) {
      sections.push({
        title: "🔥 Trending with People Like You",
        subtitle: "Popular among users with similar tastes",
        description: "What others with your preferences are loving",
        recipes: trendingRecipes.slice(0, 4),
        icon: "🔥",
        priority: 6
      });
    }

    // 7. New Discoveries
    const newDiscoveries = getNewDiscoveries(preferences);
    if (newDiscoveries.length > 0) {
      sections.push({
        title: "✨ Discover Something New",
        subtitle: "Step out of your comfort zone",
        description: "Highly rated dishes you haven't tried yet",
        recipes: newDiscoveries.slice(0, 4),
        icon: "✨",
        priority: 7
      });
    }

    // Sort by priority and take top 3 sections
    const sortedSections = sections.sort((a, b) => a.priority - b.priority).slice(0, 3);
    setPersonalizedSections(sortedSections);
  };

  // Helper functions for recommendation logic
  const getFrequentCuisines = (orderHistory) => {
    const cuisineCount = {};
    orderHistory.forEach(order => {
      if (order.cuisine) {
        cuisineCount[order.cuisine] = (cuisineCount[order.cuisine] || 0) + 1;
      }
    });
    return Object.keys(cuisineCount).sort((a, b) => cuisineCount[b] - cuisineCount[a]);
  };

  const findSimilarRecipes = (cuisines) => {
    return recipes.filter(recipe => cuisines.includes(recipe.cuisine));
  };

  const filterByPricePreference = (recipes, priceRange) => {
    const priceRanges = {
      'low': [0, 200],
      'medium': [150, 400],
      'high': [300, 1000]
    };
    
    const [min, max] = priceRanges[priceRange] || priceRanges['medium'];
    return recipes.filter(recipe => recipe.price >= min && recipe.price <= max);
  };

  const filterByDietaryPreferences = (recipes, preferences) => {
    return recipes.filter(recipe => {
      const title = recipe.title.toLowerCase();
      const description = recipe.description.toLowerCase();
      
      return preferences.some(pref => {
        const prefLower = pref.toLowerCase();
        return title.includes(prefLower) || description.includes(prefLower);
      });
    });
  };

  const findSimilarToViewed = (viewedIds) => {
    // Find recipes similar to recently viewed ones
    const viewedRecipes = recipes.filter(recipe => viewedIds.includes(recipe.id));
    const viewedCuisines = [...new Set(viewedRecipes.map(r => r.cuisine))];
    
    return recipes.filter(recipe => 
      viewedCuisines.includes(recipe.cuisine) && !viewedIds.includes(recipe.id)
    );
  };

  const getTrendingForSimilarUsers = (preferences) => {
    // Simulate trending recipes for users with similar preferences
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  const getNewDiscoveries = (preferences) => {
    // Find highly rated recipes from cuisines user hasn't tried much
    const triedCuisines = preferences.favoriteCuisines || [];
    const newCuisineRecipes = recipes.filter(recipe => 
      !triedCuisines.includes(recipe.cuisine)
    );
    
    return newCuisineRecipes.sort(() => 0.5 - Math.random());
  };

  // Track user interactions
  const trackInteraction = async (action, recipeId, additionalData = {}) => {
    const interaction = {
      action,
      recipeId,
      timestamp: new Date().toISOString(),
      ...additionalData
    };

    // Update local preferences
    const updatedPreferences = { ...userPreferences };
    
    if (action === 'view') {
      updatedPreferences.lastViewedRecipes = [
        ...(updatedPreferences.lastViewedRecipes || []).filter(id => id !== recipeId),
        recipeId
      ].slice(-20); // Keep last 20 viewed
    } else if (action === 'add_to_cart') {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe && recipe.cuisine) {
        updatedPreferences.favoriteCuisines = [
          ...(updatedPreferences.favoriteCuisines || []).filter(c => c !== recipe.cuisine),
          recipe.cuisine
        ].slice(-10); // Keep top 10 cuisines
      }
    }

    setUserPreferences(updatedPreferences);
    
    // Save to localStorage
    localStorage.setItem(
      `userPreferences_${currentUser?.uid || 'guest'}`, 
      JSON.stringify(updatedPreferences)
    );

    // Try to save to backend
    if (currentUser) {
      try {
        await fetch(`http://localhost:5000/api/user-preferences/${currentUser.uid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPreferences)
        });
      } catch (error) {
        console.log('Could not save to backend:', error);
      }
    }
  };

  const handleAddToCart = (recipe) => {
    const cartItem = {
      _id: recipe.id,
      name: recipe.title,
      price: recipe.price,
      image: recipe.image,
      description: recipe.description
    };
    addToCart(cartItem);
    trackInteraction('add_to_cart', recipe.id, { cuisine: recipe.cuisine });
  };

  const handleViewRecipe = (recipeId) => {
    trackInteraction('view', recipeId);
    navigate(`/recipe/${recipeId}`);
  };

  if (!currentUser) {
    return (
      <div className="personalized-recommendations">
        <div className="login-prompt">
          <h2>🔐 Get Personalized Recommendations</h2>
          <p>Log in to see dishes tailored just for you based on your preferences and order history!</p>
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login for Personal Recommendations
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="personalized-recommendations">
        <div className="loading-recommendations">
          <div className="loading-spinner"></div>
          <p>Crafting your personal recommendations...</p>
        </div>
      </div>
    );
  }

  if (personalizedSections.length === 0) {
    return (
      <div className="personalized-recommendations">
        <div className="no-recommendations">
          <h2>🌟 Building Your Profile</h2>
          <p>Start ordering and browsing to get personalized recommendations!</p>
          <button className="browse-btn" onClick={() => navigate('/order')}>
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="personalized-recommendations">
      <div className="personalized-header">
        <h2>🎯 Just for You, {currentUser.displayName || 'Food Lover'}!</h2>
        <p>Recommendations tailored to your taste and preferences</p>
      </div>

      {personalizedSections.map((section, index) => (
        <div key={index} className="personalized-section">
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">{section.icon}</span>
              <div>
                <h3>{section.title}</h3>
                <p className="section-subtitle">{section.subtitle}</p>
              </div>
            </div>
            <p className="section-description">{section.description}</p>
          </div>

          <div className="personalized-recipes-grid">
            {section.recipes.map((recipe) => (
              <div key={recipe.id} className="personalized-recipe-card">
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                  <div className="recipe-overlay">
                    <button 
                      className="quick-add-btn"
                      onClick={() => handleAddToCart(recipe)}
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="recipe-info">
                  <h4>{recipe.title}</h4>
                  <p className="recipe-cuisine">{recipe.cuisine}</p>
                  <div className="recipe-price">₹{recipe.price}</div>
                  <button 
                    className="view-recipe-btn"
                    onClick={() => handleViewRecipe(recipe.id)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="personalization-info">
        <div className="info-card">
          <h3>🧠 How We Personalize</h3>
          <ul>
            <li>📊 Your order history and preferences</li>
            <li>👀 Recipes you've viewed recently</li>
            <li>🍽️ Your favorite cuisines and dietary needs</li>
            <li>💰 Your preferred price range</li>
            <li>🔥 What's trending with similar users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
