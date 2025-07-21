const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  translatedRecipeName: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  totalTimeInMins: {
    type: Number,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  translatedInstructions: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: false
  },
  cleanedIngredients: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  ingredientCount: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('recipes', RecipeSchema);
