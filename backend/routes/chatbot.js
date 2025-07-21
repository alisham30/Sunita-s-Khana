const express = require('express');
const router = express.Router();

// Sample recipe knowledge base
const recipeKnowledge = {
  'butter chicken': {
    name: 'Butter Chicken',
    ingredients: [
      '500g boneless chicken pieces',
      '2 tbsp butter',
      '1 cup tomato puree',
      '1/2 cup cream',
      '1 tbsp ginger-garlic paste',
      '1 tsp red chili powder',
      '1 tsp garam masala',
      '1/2 tsp turmeric powder',
      'Salt to taste',
      'Fresh coriander for garnish'
    ],
    instructions: 'Marinate chicken with yogurt and spices. Cook in butter. Add tomato puree and simmer. Finish with cream and garnish with coriander.',
    cookingTime: '45 minutes'
  },
  'paneer tikka': {
    name: 'Paneer Tikka',
    ingredients: [
      '250g paneer cubes',
      '1 bell pepper, cubed',
      '1 onion, cubed',
      '2 tbsp yogurt',
      '1 tbsp ginger-garlic paste',
      '1 tsp red chili powder',
      '1/2 tsp garam masala',
      '1/2 tsp turmeric powder',
      'Salt to taste',
      'Fresh coriander for garnish'
    ],
    instructions: 'Mix paneer and vegetables with yogurt and spices. Skewer and grill until charred. Garnish with coriander.',
    cookingTime: '30 minutes'
  },
  'dal makhani': {
    name: 'Dal Makhani',
    ingredients: [
      '1 cup black lentils (urad dal)',
      '1/4 cup kidney beans (rajma)',
      '2 tbsp butter',
      '1/2 cup cream',
      '1 onion, finely chopped',
      '2 tomatoes, pureed',
      '1 tbsp ginger-garlic paste',
      '1 tsp cumin seeds',
      '1 tsp garam masala',
      'Salt to taste'
    ],
    instructions: 'Soak and cook lentils and beans. Sauté onions and spices. Add tomato puree and simmer. Finish with butter and cream.',
    cookingTime: '8 hours (including soaking time)'
  }
};

// Sample order processing function
const processOrder = (items) => {
  const orderItems = items.map(item => {
    return {
      name: item.name,
      quantity: item.quantity,
      price: item.price || 10.99 // Default price if not specified
    };
  });

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    orderId: 'ORD-' + Math.floor(Math.random() * 10000),
    items: orderItems,
    total: total.toFixed(2),
    estimatedDelivery: '30-45 minutes',
    status: 'confirmed'
  };
};

// AI chatbot endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const lowerMessage = message.toLowerCase();
    let response = {
      text: "I'm sorry, I don't understand. Can you try asking something about our menu, recipes, or placing an order?",
      type: 'text'
    };
    
    // Order handling
    if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      if (lowerMessage.includes('chicken') || lowerMessage.includes('butter chicken')) {
        const order = processOrder([{ name: 'Butter Chicken', quantity: 1 }]);
        response = {
          text: `Great choice! I've added Butter Chicken to your cart. Your order #${order.orderId} is confirmed with an estimated delivery time of ${order.estimatedDelivery}.`,
          type: 'order',
          orderDetails: order
        };
      } else if (lowerMessage.includes('paneer') || lowerMessage.includes('paneer tikka')) {
        const order = processOrder([{ name: 'Paneer Tikka', quantity: 1 }]);
        response = {
          text: `Excellent! I've added Paneer Tikka to your cart. Your order #${order.orderId} is confirmed with an estimated delivery time of ${order.estimatedDelivery}.`,
          type: 'order',
          orderDetails: order
        };
      } else {
        response = {
          text: "I'd be happy to help you place an order. What dish would you like to order today? We have Butter Chicken, Paneer Tikka, Dal Makhani, and many more options.",
          type: 'text'
        };
      }
    }
    
    // Recipe handling
    else if (lowerMessage.includes('recipe') || lowerMessage.includes('how to make') || lowerMessage.includes('how do you make')) {
      let recipeFound = false;
      
      for (const [key, recipe] of Object.entries(recipeKnowledge)) {
        if (lowerMessage.includes(key)) {
          response = {
            text: `Here's the recipe for ${recipe.name}:`,
            type: 'recipe',
            recipe: recipe
          };
          recipeFound = true;
          break;
        }
      }
      
      if (!recipeFound) {
        response = {
          text: "I'd be happy to share a recipe with you. Which dish are you interested in? We have recipes for Butter Chicken, Paneer Tikka, Dal Makhani, and more.",
          type: 'text'
        };
      }
    }
    
    // Menu inquiry
    else if (lowerMessage.includes('menu') || lowerMessage.includes('what do you have') || lowerMessage.includes('what do you serve')) {
      response = {
        text: "Our menu features a variety of authentic Indian dishes including Butter Chicken, Paneer Tikka, Dal Makhani, Chicken Biryani, Vegetable Korma, and many more. Would you like to know more about any specific dish?",
        type: 'text'
      };
    }
    
    // General greetings
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage === 'hi') {
      response = {
        text: "Hello! Welcome to Sunita's Khana. How may I assist you today? I can help with recipes, taking orders, or answering questions about our food!",
        type: 'text'
      };
    }
    
    // Thanks handling
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      response = {
        text: "You're welcome! Is there anything else I can help you with today?",
        type: 'text'
      };
    }
    
    // Goodbye handling
    else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      response = {
        text: "Thank you for chatting with me! Enjoy your day and we hope to see you at Sunita's Khana soon!",
        type: 'text'
      };
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
