import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm Sunita's AI assistant. How can I help you today? I can help with recipes, taking orders, or answering questions about our food!", 
      sender: 'bot' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  // Sample responses based on keywords
  const sampleResponses = {
    order: "I'd be happy to help you place an order! What dishes would you like to order today?",
    recipe: "I can share recipes or cooking tips! Which dish are you interested in learning about?",
    menu: "Our menu features a variety of authentic Indian dishes including curries, biryanis, and vegetarian options. Would you like me to recommend something?",
    hours: "We're open daily from 11:00 AM to 10:00 PM. Our delivery service runs until 9:30 PM.",
    delivery: "Yes, we offer delivery within a 5-mile radius. Delivery is free for orders over $30!",
    spicy: "We can adjust the spice level of most dishes according to your preference. Just let me know how spicy you'd like your food!",
    hello: "Hello there! How can I assist you with Sunita's Khana today?",
    hi: "Hi! Welcome to Sunita's Khana. How may I help you?",
    thanks: "You're welcome! Is there anything else I can help you with?",
    thank: "You're welcome! Is there anything else I can help you with?",
    bye: "Thank you for chatting with me! Enjoy your day and hope to see you at Sunita's Khana soon!"
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message to chat
    const newMessages = [...messages, { text: inputText, sender: 'user' }];
    setMessages(newMessages);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Get user ID from auth context if available
      const userId = currentUser ? currentUser.uid : 'guest';
      
      // Call backend API
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: inputText,
        userId: userId
      });
      
      const botData = response.data.response;
      
      // Handle different response types
      if (botData.type === 'recipe') {
        // For recipe responses
        const recipe = botData.recipe;
        const recipeText = `${botData.text}\n\n${recipe.name}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions}\n\nCooking Time: ${recipe.cookingTime}`;
        
        setMessages(prev => [...prev, { text: recipeText, sender: 'bot', type: 'recipe' }]);
      } 
      else if (botData.type === 'order') {
        // For order responses
        const order = botData.orderDetails;
        const orderItems = order.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n');
        const orderText = `${botData.text}\n\nOrder #${order.orderId}\n${orderItems}\nTotal: $${order.total}\nEstimated Delivery: ${order.estimatedDelivery}`;
        
        setMessages(prev => [...prev, { text: orderText, sender: 'bot', type: 'order' }]);
      }
      else {
        // For regular text responses
        setMessages(prev => [...prev, { text: botData.text, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error communicating with chatbot API:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my brain right now. Please try again later!", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          <i className="fas fa-comment"></i>
          <span>Chat with Sunita</span>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Chat with Sunita's AI</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
