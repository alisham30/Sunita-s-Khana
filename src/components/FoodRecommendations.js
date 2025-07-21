import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../styles/FoodRecommendations.css';

const FoodRecommendations = ({ recipes = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Catchy food recommendations based on time of day, weather, mood, etc.
  const catchyRecommendations = [
    {
      title: "🌅 Morning Energy Boosters",
      subtitle: "Start your day right!",
      description: "Fuel your morning with these power-packed breakfast delights",
      keywords: ["paratha", "dosa", "upma", "poha", "breakfast"],
      time: [6, 7, 8, 9, 10],
      emoji: "☀️"
    },
    {
      title: "🍛 Comfort Food Classics",
      subtitle: "When you need a warm hug",
      description: "Soul-warming dishes that feel like home",
      keywords: ["rajma", "dal", "khichdi", "curry", "rice"],
      time: [11, 12, 13, 14, 15],
      emoji: "🤗"
    },
    {
      title: "🌶️ Spice It Up!",
      subtitle: "For the bold and adventurous",
      description: "Fiery flavors that pack a punch",
      keywords: ["biryani", "tandoori", "masala", "spicy", "hot"],
      time: [16, 17, 18, 19],
      emoji: "🔥"
    },
    {
      title: "🌙 Evening Comfort",
      subtitle: "Unwind with these delights",
      description: "Perfect evening treats to end your day",
      keywords: ["snacks", "chaat", "samosa", "pakora", "tea"],
      time: [20, 21, 22, 23],
      emoji: "🌆"
    },
    {
      title: "👑 Chef's Special",
      subtitle: "Handpicked by Sunita",
      description: "Signature dishes you absolutely must try",
      keywords: ["special", "signature", "premium", "chef"],
      time: "all",
      emoji: "⭐"
    },
    {
      title: "💚 Healthy & Fresh",
      subtitle: "Guilt-free indulgence",
      description: "Nutritious meals that don't compromise on taste",
      keywords: ["healthy", "fresh", "salad", "grilled", "steamed"],
      time: "all",
      emoji: "🥗"
    },
    {
      title: "🎉 Party Favorites",
      subtitle: "Crowd pleasers",
      description: "Perfect for sharing and celebrating",
      keywords: ["party", "sharing", "platter", "combo", "family"],
      time: "all",
      emoji: "🎊"
    },
    {
      title: "🏃‍♂️ Quick Bites",
      subtitle: "Fast & delicious",
      description: "When you're in a hurry but won't settle for less",
      keywords: ["quick", "fast", "instant", "ready", "snack"],
      time: "all",
      emoji: "⚡"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      generateRecommendations();
    }
  }, [recipes, currentTime]);

  const generateRecommendations = () => {
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Filter recommendations based on time
    const timeBasedRecommendations = catchyRecommendations.filter(rec => {
      if (rec.time === "all") return true;
      return rec.time.includes(hour);
    });

    // Add special weekend/weekday recommendations
    if (isWeekend) {
      timeBasedRecommendations.push({
        title: "🎯 Weekend Special",
        subtitle: "Because weekends deserve better",
        description: "Indulgent treats for your leisure time",
        keywords: ["special", "premium", "indulgent"],
        emoji: "🎯"
      });
    }

    // Generate recipe recommendations for each category
    const finalRecommendations = timeBasedRecommendations.slice(0, 3).map(category => {
      const matchingRecipes = recipes.filter(recipe => 
        category.keywords.some(keyword => 
          recipe.title.toLowerCase().includes(keyword) ||
          recipe.description.toLowerCase().includes(keyword) ||
          (recipe.cuisine && recipe.cuisine.toLowerCase().includes(keyword))
        )
      );

      // If no exact matches, get random recipes
      const selectedRecipes = matchingRecipes.length > 0 
        ? matchingRecipes.slice(0, 4)
        : getRandomRecipes(4);

      return {
        ...category,
        recipes: selectedRecipes
      };
    });

    setRecommendations(finalRecommendations);
  };

  const getRandomRecipes = (count) => {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
  };

  const handleViewMore = (category) => {
    navigate('/order', { state: { searchTerm: category.keywords[0] } });
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="food-recommendations">
      <div className="recommendations-header">
        <h2>🍽️ Curated Just For You</h2>
        <p>Discover amazing flavors tailored to your taste and time</p>
      </div>

      {recommendations.map((category, index) => (
        <div key={index} className="recommendation-category">
          <div className="category-header">
            <div className="category-title">
              <span className="category-emoji">{category.emoji}</span>
              <div>
                <h3>{category.title}</h3>
                <p className="category-subtitle">{category.subtitle}</p>
              </div>
            </div>
            <p className="category-description">{category.description}</p>
          </div>

          <div className="recipes-grid">
            {category.recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-recommendation-card">
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
                </div>
              </div>
            ))}
          </div>

          <div className="category-footer">
            <button 
              className="view-more-btn"
              onClick={() => handleViewMore(category)}
            >
              Explore More {category.emoji}
            </button>
          </div>
        </div>
      ))}

      <div className="recommendations-footer">
        <div className="fun-facts">
          <h3>🎯 Did You Know?</h3>
          <div className="facts-grid">
            <div className="fact-card">
              <span className="fact-emoji">🌶️</span>
              <p>Indian cuisine uses over 40 different spices!</p>
            </div>
            <div className="fact-card">
              <span className="fact-emoji">🍛</span>
              <p>Each region has its own unique cooking style</p>
            </div>
            <div className="fact-card">
              <span className="fact-emoji">❤️</span>
              <p>Food tastes better when made with love</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodRecommendations;
