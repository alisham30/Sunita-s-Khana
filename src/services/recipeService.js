import axios from 'axios';

// Configure base URL for API requests
const API_URL = 'http://localhost:5000/api/recipes';

// Configure axios with default timeout and headers
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all recipes
export const getAllRecipes = async () => {
  try {
    console.log('Making API request to:', API_URL);
    const response = await api.get('/');
    console.log('API response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    }
    throw error;
  }
};

// Get a single recipe by ID
export const getRecipeById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error.message);
    throw error;
  }
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  try {
    const response = await api.post('/', recipeData);
    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error.message);
    throw error;
  }
};

// Update a recipe
export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await api.put(`/${id}`, recipeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating recipe with ID ${id}:`, error.message);
    throw error;
  }
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting recipe with ID ${id}:`, error.message);
    throw error;
  }
};

// Import recipes from CSV
export const importRecipesFromCSV = async () => {
  try {
    const response = await api.post('/import-csv');
    return response.data;
  } catch (error) {
    console.error('Error importing recipes from CSV:', error.message);
    throw error;
  }
};

// Search recipes by name or cuisine
export const searchRecipes = async (query) => {
  try {
    const response = await api.get(`/search/${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching recipes with query ${query}:`, error.message);
    throw error;
  }
};
