const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Recipe model
const Recipe = require('../models/Recipe');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample recipe data - 10 popular Indian recipes
const recipes = [
  {
    translatedRecipeName: "Butter Chicken",
    ingredients: "chicken, yogurt, butter, cream, tomato puree, garam masala, ginger, garlic, chili powder",
    cleanedIngredients: "chicken, yogurt, butter, cream, tomato puree, garam masala, ginger, garlic, chili powder",
    totalTimeInMins: 45,
    cuisine: "North Indian",
    translatedInstructions: "1. Marinate chicken in yogurt and spices. 2. Cook in butter until golden. 3. Add tomato puree and simmer. 4. Finish with cream and garnish with coriander.",

    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YnV0dGVyJTIwY2hpY2tlbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    ingredientCount: 9
  },
  {
    translatedRecipeName: "Paneer Tikka Masala",
    ingredients: "paneer, yogurt, bell peppers, onions, tomatoes, cream, garam masala, turmeric, chili powder",
    cleanedIngredients: "paneer, yogurt, bell peppers, onions, tomatoes, cream, garam masala, turmeric, chili powder",
    totalTimeInMins: 35,
    cuisine: "North Indian",
    translatedInstructions: "1. Marinate paneer and vegetables in yogurt and spices. 2. Grill until charred. 3. Prepare tomato gravy. 4. Add grilled paneer and vegetables. 5. Finish with cream.",

    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    ingredientCount: 9
  },
  {
    translatedRecipeName: "Masala Dosa",
    ingredients: "rice, urad dal, potato, onion, mustard seeds, curry leaves, turmeric, green chili, oil",
    cleanedIngredients: "rice, urad dal, potato, onion, mustard seeds, curry leaves, turmeric, green chili, oil",
    totalTimeInMins: 480, // Including fermentation time
    cuisine: "South Indian",
    translatedInstructions: "1. Soak rice and dal. 2. Grind to make batter and ferment. 3. Prepare potato filling with spices. 4. Spread batter on hot griddle. 5. Add filling and fold.",
    imageUrl: "https://culinarydelightsandbeyond.com/wp-content/uploads/2023/03/dosa-5oF7d_hPJG4-scaled.jpg",
    ingredientCount: 9
  },
  {
    translatedRecipeName: "Chicken Biryani",
    ingredients: "basmati rice, chicken, yogurt, onions, tomatoes, ginger, garlic, biryani masala, mint, coriander",
    cleanedIngredients: "basmati rice, chicken, yogurt, onions, tomatoes, ginger, garlic, biryani masala, mint, coriander",
    totalTimeInMins: 60,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Marinate chicken. 2. Partially cook rice. 3. Layer rice and chicken. 4. Cook on dum (slow heat) until done. 5. Garnish with fried onions and mint.",
    imageUrl: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Chole Bhature",
    ingredients: "chickpeas, flour, yogurt, baking soda, onions, tomatoes, ginger, garlic, garam masala, amchur powder",
    cleanedIngredients: "chickpeas, flour, yogurt, baking soda, onions, tomatoes, ginger, garlic, garam masala, amchur powder",
    totalTimeInMins: 90,
    cuisine: "Punjabi",
    translatedInstructions: "1. Soak chickpeas overnight. 2. Pressure cook with spices. 3. Prepare dough for bhature and let it rest. 4. Deep fry bhature. 5. Serve hot with chole.",

    imageUrl: "https://cdn.uengage.io/uploads/28289/image-14DG1B-1723180624.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Palak Paneer",
    ingredients: "spinach, paneer, onion, tomato, ginger, garlic, green chili, cream, garam masala, cumin",
    cleanedIngredients: "spinach, paneer, onion, tomato, ginger, garlic, green chili, cream, garam masala, cumin",
    totalTimeInMins: 40,
    cuisine: "North Indian",
    translatedInstructions: "1. Blanch spinach and puree. 2. Saute onions, ginger, garlic. 3. Add tomatoes and spices. 4. Mix in spinach puree. 5. Add paneer cubes and simmer. 6. Finish with cream.",
    imageUrl: "https://spicecravings.com/wp-content/uploads/2017/08/Palak-Paneer-5.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Rogan Josh",
    ingredients: "lamb, yogurt, onions, ginger, garlic, Kashmiri red chili, fennel seeds, garam masala, cardamom, cinnamon",
    cleanedIngredients: "lamb, yogurt, onions, ginger, garlic, Kashmiri red chili, fennel seeds, garam masala, cardamom, cinnamon",
    totalTimeInMins: 90,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Marinate lamb in yogurt and spices. 2. Brown onions. 3. Add lamb and cook until tender. 4. Simmer with spices until the gravy thickens. 5. Garnish with coriander.",

    imageUrl: "https://static.toiimg.com/thumb/53192600.cms?width=1200&height=900",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Aloo Gobi",
    ingredients: "potato, cauliflower, onion, tomato, ginger, garlic, turmeric, cumin, coriander powder, garam masala",
    cleanedIngredients: "potato, cauliflower, onion, tomato, ginger, garlic, turmeric, cumin, coriander powder, garam masala",
    totalTimeInMins: 35,
    cuisine: "North Indian",
    translatedInstructions: "1. Saute onions until golden. 2. Add ginger, garlic, and spices. 3. Add potatoes and cook partially. 4. Add cauliflower and cook until tender. 5. Garnish with fresh coriander.",
   
    imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/aloo-gobi-recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Malai Kofta",
    ingredients: "paneer, potato, cream, cashews, raisins, onion, tomato, ginger, garlic, garam masala",
    cleanedIngredients: "paneer, potato, cream, cashews, raisins, onion, tomato, ginger, garlic, garam masala",
    totalTimeInMins: 60,
    cuisine: "Mughlai",
    translatedInstructions: "1. Mix paneer and potato to make kofta mixture. 2. Stuff with nuts and raisins. 3. Deep fry koftas. 4. Prepare creamy tomato gravy. 5. Add koftas just before serving.",
    
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsT8TUD-NzEQeESGXCTvbEFMbcMp-heDW-Kw&s",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Vegetable Samosa",
    ingredients: "flour, potato, peas, onion, ginger, green chili, cumin, coriander powder, garam masala, oil",
    cleanedIngredients: "flour, potato, peas, onion, ginger, green chili, cumin, coriander powder, garam masala, oil",
    totalTimeInMins: 60,
    cuisine: "North Indian",
    translatedInstructions: "1. Prepare dough and rest. 2. Cook potato and pea filling with spices. 3. Roll dough into circles. 4. Fill and shape into triangles. 5. Deep fry until golden brown.",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Ftb3NhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Shahi Paneer",
    ingredients: "paneer, cashews, cream, onions, tomatoes, ginger, garlic, cardamom, cinnamon, saffron",
    cleanedIngredients: "paneer, cashews, cream, onions, tomatoes, ginger, garlic, cardamom, cinnamon, saffron",
    totalTimeInMins: 45,
    cuisine: "Mughlai",
    translatedInstructions: "1. Soak cashews and make paste. 2. Saute onions and spices. 3. Add tomato puree and cook. 4. Add cashew paste and cream. 5. Add paneer cubes and simmer. 6. Garnish with saffron.",

    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hhaGklMjBwYW5lZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Murgh Musallam",
    ingredients: "whole chicken, yogurt, onions, tomatoes, ginger, garlic, cashews, almonds, saffron, garam masala",
    cleanedIngredients: "whole chicken, yogurt, onions, tomatoes, ginger, garlic, cashews, almonds, saffron, garam masala",
    totalTimeInMins: 120,
    cuisine: "Mughlai",
    translatedInstructions: "1. Marinate whole chicken in yogurt and spices. 2. Prepare rich gravy with nuts and spices. 3. Cook chicken in gravy on low heat. 4. Garnish with saffron and fried nuts.",

    imageUrl: "https://lh5.googleusercontent.com/proxy/YTqu6z-13bw3kMZIDFdWcISXepDokvWU9ZSvTgH7nAwGSHBhQnYkjlkjNnpupu9s66C9SfEgRbU4to4lijgbyPZsfATaQhM",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Nargisi Kofta",
    ingredients: "eggs, minced meat, onions, ginger, garlic, green chilies, garam masala, coriander, yogurt, cream",
    cleanedIngredients: "eggs, minced meat, onions, ginger, garlic, green chilies, garam masala, coriander, yogurt, cream",
    totalTimeInMins: 75,
    cuisine: "Mughlai",
    translatedInstructions: "1. Boil and peel eggs. 2. Cover eggs with spiced minced meat. 3. Deep fry until golden. 4. Prepare creamy gravy. 5. Add koftas to gravy before serving.",

    imageUrl: "https://www.thespruceeats.com/thmb/Q-TzG4FsMMbkPIqxy2lCoQcZU28=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/NargisiKoftas-56a511073df78cf772862ccb.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Shahi Tukda",
    ingredients: "bread slices, ghee, milk, sugar, cardamom, saffron, pistachios, almonds, rose water, silver leaf",
    cleanedIngredients: "bread slices, ghee, milk, sugar, cardamom, saffron, pistachios, almonds, rose water, silver leaf",
    totalTimeInMins: 40,
    cuisine: "Mughlai",
    translatedInstructions: "1. Fry bread slices in ghee until golden. 2. Soak in sugar syrup. 3. Prepare thickened saffron-flavored milk. 4. Pour over bread. 5. Garnish with nuts and silver leaf.",

    imageUrl: "https://www.whiskaffair.com/wp-content/uploads/2019/03/Shahi-Tukda-2-3.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Pasanda",
    ingredients: "lamb, yogurt, almonds, cashews, cream, onions, ginger, garlic, garam masala, cardamom",
    cleanedIngredients: "lamb, yogurt, almonds, cashews, cream, onions, ginger, garlic, garam masala, cardamom",
    totalTimeInMins: 90,
    cuisine: "Mughlai",
    translatedInstructions: "1. Flatten lamb pieces and marinate in yogurt. 2. Prepare nut paste. 3. Cook lamb with spices. 4. Add nut paste and cream. 5. Simmer until meat is tender and gravy thickens.",

    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPE5JjnwepJqiyUeUgV8DtvaKOX44IQV8RjQ&s",
    ingredientCount: 10
  },
  
  {
    translatedRecipeName: "Kashmiri Dum Aloo",
    ingredients: "baby potatoes, yogurt, Kashmiri red chili, fennel seeds, ginger, asafoetida, mustard oil, cardamom, cinnamon, bay leaf",
    cleanedIngredients: "baby potatoes, yogurt, Kashmiri red chili, fennel seeds, ginger, asafoetida, mustard oil, cardamom, cinnamon, bay leaf",
    totalTimeInMins: 60,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Deep fry baby potatoes. 2. Prepare yogurt gravy with Kashmiri spices. 3. Add potatoes to gravy. 4. Cook on low heat (dum style) until flavors meld. 5. Garnish with fresh coriander.",

    imageUrl: "https://www.whiskaffair.com/wp-content/uploads/2019/03/Kashmiri-Dum-Aloo-2-3.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Yakhni Pulao",
    ingredients: "basmati rice, lamb, yogurt, onions, fennel seeds, cardamom, cinnamon, cloves, bay leaf, ghee",
    cleanedIngredients: "basmati rice, lamb, yogurt, onions, fennel seeds, cardamom, cinnamon, cloves, bay leaf, ghee",
    totalTimeInMins: 90,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Prepare meat stock with whole spices. 2. Strain and reserve the stock. 3. Cook rice in the flavored stock. 4. Layer with meat pieces. 5. Finish with fried onions and mint.",

    imageUrl: "https://jamilghar.com/wp-content/uploads/2023/04/Chicken-Yakhni-Pulao11.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Kashmiri Haak",
    ingredients: "collard greens, mustard oil, asafoetida, green chilies, dried red chilies, salt, water",
    cleanedIngredients: "collard greens, mustard oil, asafoetida, green chilies, dried red chilies, salt, water",
    totalTimeInMins: 30,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Heat mustard oil. 2. Add asafoetida and chilies. 3. Add washed and chopped greens. 4. Cook covered on low heat. 5. Serve hot with rice.",

    imageUrl: "https://i0.wp.com/farm1.static.flickr.com/190/497683066_42bec64bc0.jpg",
    ingredientCount: 7
  },
  {
    translatedRecipeName: "Kashmiri Rajma",
    ingredients: "kidney beans, onions, tomatoes, ginger, garlic, fennel powder, dried ginger powder, Kashmiri red chili, yogurt, ghee",
    cleanedIngredients: "kidney beans, onions, tomatoes, ginger, garlic, fennel powder, dried ginger powder, Kashmiri red chili, yogurt, ghee",
    totalTimeInMins: 120,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Soak beans overnight. 2. Pressure cook until tender. 3. Prepare gravy with onions, tomatoes and spices. 4. Add beans and simmer. 5. Finish with a dollop of yogurt.",

    imageUrl: "https://www.chefkunalkapur.com/wp-content/uploads/2022/02/rajma.jpg?v=1645539065",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Modur Pulao",
    ingredients: "basmati rice, ghee, milk, sugar, saffron, cardamom, cinnamon, cloves, almonds, raisins",
    cleanedIngredients: "basmati rice, ghee, milk, sugar, saffron, cardamom, cinnamon, cloves, almonds, raisins",
    totalTimeInMins: 45,
    cuisine: "Kashmiri",
    translatedInstructions: "1. Soak rice and drain. 2. Heat ghee and add whole spices. 3. Add rice and sauté. 4. Add milk, sugar, and saffron. 5. Cook until done. 6. Garnish with fried nuts and raisins.",

    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC_BGFGxyYM7_ZLuJ7RUwT7jfmhE-ZRLZIHA&s",
    ingredientCount: 10
  },

  {
    translatedRecipeName: "Idli Sambar",
    ingredients: "rice, urad dal, fenugreek seeds, toor dal, tamarind, sambar powder, mustard seeds, curry leaves, tomato, onion",
    cleanedIngredients: "rice, urad dal, fenugreek seeds, toor dal, tamarind, sambar powder, mustard seeds, curry leaves, tomato, onion",
    totalTimeInMins: 480, // Including fermentation time
    cuisine: "South Indian",
    translatedInstructions: "1. Soak rice and dal, grind and ferment for idli batter. 2. Steam idlis. 3. Cook toor dal with vegetables. 4. Add tamarind extract and sambar powder. 5. Temper with mustard seeds and curry leaves.",

    imageUrl: "https://www.nehascookbook.com/wp-content/uploads/2022/09/Instant-idli-sambar-WS-1.jpg",
    ingredientCount: 10
  },
  
  {
    translatedRecipeName: "Hyderabadi Lukhmi",
    ingredients: "flour, ghee, minced meat, onions, ginger, garlic, mint, coriander, garam masala, green chilies",
    cleanedIngredients: "flour, ghee, minced meat, onions, ginger, garlic, mint, coriander, garam masala, green chilies",
    totalTimeInMins: 60,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Prepare dough with flour and ghee. 2. Cook minced meat with spices and herbs. 3. Roll dough into squares. 4. Fill with meat mixture. 5. Seal edges and deep fry until golden.",

    imageUrl: "https://cdn.tasteatlas.com/images/dishes/50b6955a759d4cd3a7d6d62e54fc6069.jpg?w=600",
    ingredientCount: 10
  },

  {
    translatedRecipeName: "Amritsari Fish",
    ingredients: "fish fillets, gram flour, carom seeds, ginger, garlic, lemon juice, red chili powder, garam masala, chaat masala, oil",
    cleanedIngredients: "fish fillets, gram flour, carom seeds, ginger, garlic, lemon juice, red chili powder, garam masala, chaat masala, oil",
    totalTimeInMins: 40,
    cuisine: "Punjabi",
    translatedInstructions: "1. Marinate fish with lemon juice and spices. 2. Make batter with gram flour and spices. 3. Dip fish in batter. 4. Deep fry until golden and crisp. 5. Sprinkle chaat masala and serve with mint chutney.",

    imageUrl: "https://headbangerskitchen.com/wp-content/uploads/2024/06/AMRITSARIFISH-H1.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Punjabi Kadhi Pakora",
    ingredients: "gram flour, yogurt, onions, ginger, green chilies, curry leaves, mustard seeds, fenugreek seeds, turmeric, asafoetida",
    cleanedIngredients: "gram flour, yogurt, onions, ginger, green chilies, curry leaves, mustard seeds, fenugreek seeds, turmeric, asafoetida",
    totalTimeInMins: 60,
    cuisine: "Punjabi",
    translatedInstructions: "1. Make pakoras with gram flour batter. 2. Whisk yogurt with gram flour and water. 3. Temper with mustard seeds and spices. 4. Add yogurt mixture and simmer. 5. Add pakoras and cook until thickened. 6. Garnish with coriander.",

    imageUrl: "https://www.mrishtanna.com/wp-content/uploads/2022/09/punjabi-kadhi-pakora-recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Medu Vada",
    ingredients: "urad dal, rice flour, ginger, green chili, curry leaves, onion, black pepper, cumin seeds, asafoetida, oil",
    cleanedIngredients: "urad dal, rice flour, ginger, green chili, curry leaves, onion, black pepper, cumin seeds, asafoetida, oil",
    totalTimeInMins: 60,
    cuisine: "South Indian",
    translatedInstructions: "1. Soak urad dal and grind to smooth paste. 2. Add spices and herbs. 3. Shape into donuts. 4. Deep fry until golden brown. 5. Serve with coconut chutney and sambar.",

    imageUrl: "https://c.ndtvimg.com/2023-09/u113o4r_medu-vada_625x300_06_September_23.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Pongal",
    ingredients: "rice, moong dal, ghee, cumin seeds, black pepper, ginger, curry leaves, cashews, asafoetida, water",
    cleanedIngredients: "rice, moong dal, ghee, cumin seeds, black pepper, ginger, curry leaves, cashews, asafoetida, water",
    totalTimeInMins: 30,
    cuisine: "South Indian",
    translatedInstructions: "1. Roast rice and moong dal. 2. Pressure cook with water until soft. 3. Heat ghee and add cumin, pepper, and cashews. 4. Add to cooked rice-dal mixture. 5. Garnish with curry leaves.",

    imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Appam with Stew",
    ingredients: "rice, coconut, yeast, coconut milk, vegetables, cardamom, cinnamon, cloves, black pepper, curry leaves",
    cleanedIngredients: "rice, coconut, yeast, coconut milk, vegetables, cardamom, cinnamon, cloves, black pepper, curry leaves",
    totalTimeInMins: 540, // Including fermentation time
    cuisine: "South Indian",
    translatedInstructions: "1. Soak rice and grind with coconut. 2. Ferment with yeast. 3. Make thin pancakes on special pan. 4. Prepare vegetable stew with coconut milk and spices. 5. Serve appam with stew.",

    imageUrl: "https://homepressurecooking.com/wp-content/uploads/2024/07/appam-and-stew-recipe-1721660564.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Rasam",
    ingredients: "toor dal, tomatoes, tamarind, rasam powder, mustard seeds, cumin seeds, garlic, curry leaves, coriander leaves, ghee",
    cleanedIngredients: "toor dal, tomatoes, tamarind, rasam powder, mustard seeds, cumin seeds, garlic, curry leaves, coriander leaves, ghee",
    totalTimeInMins: 30,
    cuisine: "South Indian",
    translatedInstructions: "1. Cook toor dal until soft. 2. Extract tamarind juice. 3. Cook tomatoes with tamarind and spices. 4. Add cooked dal. 5. Temper with mustard, cumin, and curry leaves. 6. Garnish with coriander.",

    imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2018/11/rasam-recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Mysore Pak",
    ingredients: "gram flour, ghee, sugar, water, cardamom powder",
    cleanedIngredients: "gram flour, ghee, sugar, water, cardamom powder",
    totalTimeInMins: 40,
    cuisine: "South Indian",
    translatedInstructions: "1. Make sugar syrup. 2. Roast gram flour in ghee. 3. Mix with sugar syrup. 4. Add cardamom powder. 5. Pour into greased tray. 6. Cut into pieces when set.",

    imageUrl: "https://i0.wp.com/ahahomefoods.com/wp-content/uploads/2023/02/Milk-Mysore-Pak.png?fit=600%2C600&ssl=1",
    ingredientCount: 5
  },
  {
    translatedRecipeName: "Double Ka Meetha",
    ingredients: "bread slices, ghee, milk, sugar, saffron, cardamom, almonds, pistachios, rose water, silver leaf",
    cleanedIngredients: "bread slices, ghee, milk, sugar, saffron, cardamom, almonds, pistachios, rose water, silver leaf",
    totalTimeInMins: 40,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Fry bread slices in ghee. 2. Make sugar syrup with cardamom. 3. Soak bread in syrup. 4. Prepare thickened milk with saffron. 5. Pour over bread. 6. Garnish with nuts and silver leaf.",

    imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/03/double-ka-meetha-bread-meetha.jpg",
    ingredientCount: 10
  },

  {
    translatedRecipeName: "Hyderabadi Bagara Baingan",
    ingredients: "small eggplants, peanuts, sesame seeds, coconut, tamarind, onion, ginger, garlic, curry leaves, spices",
    cleanedIngredients: "small eggplants, peanuts, sesame seeds, coconut, tamarind, onion, ginger, garlic, curry leaves, spices",
    totalTimeInMins: 45,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Make paste of peanuts, sesame, coconut. 2. Slit eggplants crosswise. 3. Fry eggplants partially. 4. Prepare gravy with paste and spices. 5. Add eggplants and simmer until cooked.",

    imageUrl: "https://www.cubesnjuliennes.com/wp-content/uploads/2022/08/Bagara-Baingan-Recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Hyderabadi Keema",
    ingredients: "minced meat, onions, tomatoes, ginger, garlic, green chilies, mint, coriander, garam masala, lemon",
    cleanedIngredients: "minced meat, onions, tomatoes, ginger, garlic, green chilies, mint, coriander, garam masala, lemon",
    totalTimeInMins: 60,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Saute onions until golden. 2. Add ginger, garlic, and green chilies. 3. Add minced meat and brown. 4. Add tomatoes and spices. 5. Simmer until meat is cooked and gravy thickens. 6. Garnish with herbs.",

    imageUrl: "https://i.ytimg.com/vi/aLvzQOiPNHY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDOVymXKCPTZGFoQXdPsysjUOU7hA",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Punjabi Pinni",
    ingredients: "whole wheat flour, ghee, jaggery, almonds, cashews, pistachios, cardamom powder, edible gum, sesame seeds, desiccated coconut",
    cleanedIngredients: "whole wheat flour, ghee, jaggery, almonds, cashews, pistachios, cardamom powder, edible gum, sesame seeds, desiccated coconut",
    totalTimeInMins: 60,
    cuisine: "Punjabi",
    translatedInstructions: "1. Roast wheat flour in ghee until fragrant. 2. Melt jaggery and add to the mixture. 3. Add roasted nuts, seeds, and spices. 4. Mix well and shape into round balls. 5. Cool and store in airtight container.",

    imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2023/08/pinni-recipe.jpg",
    ingredientCount: 10
  },
{
    translatedRecipeName: "Hyderabadi Khatti Dal",
    ingredients: "toor dal, tamarind, tomatoes, onions, green chilies, curry leaves, mustard seeds, cumin, turmeric, coriander",
    cleanedIngredients: "toor dal, tamarind, tomatoes, onions, green chilies, curry leaves, mustard seeds, cumin, turmeric, coriander",
    totalTimeInMins: 45,
    cuisine: "Hyderabadi",
    translatedInstructions: "1. Cook toor dal until soft. 2. Extract tamarind juice. 3. Saute onions and tomatoes with spices. 4. Add tamarind juice and dal. 5. Temper with mustard seeds and curry leaves. 6. Garnish with coriander.",

    imageUrl: "https://images.archanaskitchen.com/images/recipes/indian/main-course/indian-curry-recipes/Hyderabadi_Khatti_Dal_77023f9c6e.jpg",
    ingredientCount: 10
  },

  {
    translatedRecipeName: "Punjabi Rajma",
    ingredients: "kidney beans, onions, tomatoes, ginger, garlic, cumin, coriander powder, garam masala, red chili powder, ghee",
    cleanedIngredients: "kidney beans, onions, tomatoes, ginger, garlic, cumin, coriander powder, garam masala, red chili powder, ghee",
    totalTimeInMins: 90,
    cuisine: "Punjabi",
    translatedInstructions: "1. Soak kidney beans overnight. 2. Pressure cook until soft. 3. Saute onions, ginger, garlic. 4. Add tomatoes and spices. 5. Add cooked beans and simmer. 6. Garnish with coriander and serve with rice.",

    imageUrl: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/06/Authentic-Punjabi-Rajma-Recipe.jpg",
    ingredientCount: 10
  },
  {
    translatedRecipeName: "Punjabi Makki Di Roti",
    ingredients: "corn flour, water, ghee, salt",
    cleanedIngredients: "corn flour, water, ghee, salt",
    totalTimeInMins: 30,
    cuisine: "Punjabi",
    translatedInstructions: "1. Mix corn flour with salt and water to make dough. 2. Divide into balls. 3. Roll into flat discs. 4. Cook on hot griddle. 5. Apply ghee on both sides. 6. Serve hot with sarson da saag.",

    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYi45qXf8-QuAJlTdu8X0ATFlKEmVnREMGHw&s",
    ingredientCount: 4
  },

];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');
    
    // Insert new recipes
    const createdRecipes = await Recipe.insertMany(recipes);
    console.log(`Successfully seeded ${createdRecipes.length} recipes`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
