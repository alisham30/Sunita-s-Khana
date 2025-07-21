import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipes-page">
      <Navbar />
      
      <div className="recipes-container">
        <h1>Traditional Indian Recipes</h1>
        <p className="recipes-intro">
          Explore our collection of authentic Indian recipes that you can make at home. 
          Each recipe includes detailed instructions and a list of ingredients.
        </p>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again later.</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div 
                className="recipe-card" 
                key={recipe._id}
                onClick={() => openRecipeModal(recipe)}
              >
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.name} />
                </div>
                <div className="recipe-info">
                  <h3>{recipe.name}</h3>
                  <p className="recipe-category">{recipe.category}</p>
                  <div className="recipe-meta">
                    <span><i className="fas fa-clock"></i> {recipe.prepTime} mins</span>
                    <span><i className="fas fa-utensils"></i> {recipe.difficulty || 'Medium'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="recipe-modal-overlay" onClick={closeRecipeModal}>
          <div className="recipe-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeRecipeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="recipe-modal-header">
              <h2>{selectedRecipe.name}</h2>
              <p className="recipe-category">{selectedRecipe.category}</p>
            </div>
            
            <div className="recipe-modal-image">
              <img src={selectedRecipe.image} alt={selectedRecipe.name} />
            </div>
            
            <div className="recipe-modal-meta">
              <span><i className="fas fa-clock"></i> Prep Time: {selectedRecipe.prepTime} mins</span>
              <span><i className="fas fa-utensils"></i> Difficulty: {selectedRecipe.difficulty || 'Medium'}</span>
              <span><i className="fas fa-users"></i> Servings: {selectedRecipe.servings || '4'}</span>
            </div>
            
            <div className="recipe-modal-content">
              <div className="ingredients">
                <h3>Ingredients</h3>
                <ul>
                  {selectedRecipe.ingredients && selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="instructions">
                <h3>Instructions</h3>
                <ol>
                  {selectedRecipe.instructions && selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Recipes;
