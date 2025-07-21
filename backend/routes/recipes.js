const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new recipe
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    translatedRecipeName: req.body.translatedRecipeName,
    translatedIngredients: req.body.translatedIngredients,
    totalTimeInMins: req.body.totalTimeInMins,
    cuisine: req.body.cuisine,
    translatedInstructions: req.body.translatedInstructions,
    url: req.body.url,
    cleanedIngredients: req.body.cleanedIngredients,
    imageUrl: req.body.imageUrl,
    ingredientCount: req.body.ingredientCount
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Import recipes from CSV file
router.post('/import-csv', async (req, res) => {
  try {
    const csvFilePath = path.join(__dirname, '../../Cleaned_Indian_Food_Dataset.csv');
    const results = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Convert CSV data to match our schema
          const recipes = results.map(item => ({
            translatedRecipeName: item.TranslatedRecipeName,
            translatedIngredients: item.TranslatedIngredients,
            totalTimeInMins: parseInt(item.TotalTimeInMins) || 0,
            cuisine: item.Cuisine,
            translatedInstructions: item.TranslatedInstructions,
            url: item.URL,
            cleanedIngredients: item['Cleaned-Ingredients'],
            imageUrl: item['image-url'],
            ingredientCount: parseInt(item['Ingredient-count']) || 0
          }));
          
          // Clear existing recipes before import (optional)
          await Recipe.deleteMany({});
          
          // Insert all recipes into the database
          await Recipe.insertMany(recipes);
          res.status(200).json({ message: `Successfully imported ${recipes.length} recipes` });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search recipes by cuisine or name
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const recipes = await Recipe.find({
      $or: [
        { translatedRecipeName: { $regex: searchQuery, $options: 'i' } },
        { cuisine: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
