const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const dotenv = require('dotenv');
const Recipe = require('./models/Recipe');

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunitasKhana';

// Function to import data
async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Clear existing data
    await Recipe.deleteMany({});
    console.log('Existing recipes cleared');
    
    const csvFilePath = path.join(__dirname, '../Cleaned_Indian_Food_Dataset.csv');
    const results = [];
    
    // Read and parse the CSV file
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
          
          // Insert all recipes into the database
          await Recipe.insertMany(recipes);
          console.log(`Successfully imported ${recipes.length} recipes`);
          
          // Disconnect from MongoDB
          mongoose.disconnect();
          console.log('Import complete!');
        } catch (err) {
          console.error('Error importing data:', err);
          mongoose.disconnect();
        }
      });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Run the import function
importData();
