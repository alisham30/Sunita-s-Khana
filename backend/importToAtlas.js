const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Recipe model
const Recipe = require('./models/Recipe');

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);
}

// Function to import data
async function importData() {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connected successfully');
    
    // Clear existing data
    console.log('Clearing existing recipes...');
    await Recipe.deleteMany({});
    console.log('Existing recipes cleared');
    
    const csvFilePath = path.join(__dirname, '../Cleaned_Indian_Food_Dataset.csv');
    const results = [];
    
    console.log('Reading CSV file...');
    
    // Read and parse the CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`CSV file read successfully. Found ${results.length} recipes.`);
          
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
          console.log('Importing recipes to MongoDB Atlas...');
          await Recipe.insertMany(recipes);
          console.log(`Successfully imported ${recipes.length} recipes to MongoDB Atlas`);
          
          // Disconnect from MongoDB
          mongoose.disconnect();
          console.log('Import complete!');
          process.exit(0);
        } catch (err) {
          console.error('Error importing data:', err);
          mongoose.disconnect();
          process.exit(1);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        mongoose.disconnect();
        process.exit(1);
      });
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  }
}

// Run the import function
importData();
