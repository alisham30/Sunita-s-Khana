import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      <div className="about-container">
        <div className="about-header">
          <h1>About Sunita's Khana</h1>
          <div className="about-tagline">Authentic Indian Cuisine, Delivered to Your Doorstep</div>
        </div>
        
        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Sunita's Khana began with a simple passion for authentic Indian cooking. Founded by Sunita Mathias in 2020, 
              our journey started in a small kitchen with family recipes passed down through generations.
            </p>
            <p>
              What began as cooking for friends and family quickly grew into a beloved culinary destination 
              for those seeking genuine Indian flavors. Today, we're proud to bring these time-honored recipes 
              directly to your home, prepared with the same care and attention to detail as they would be in our own kitchen.
            </p>
          </div>
          
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60" 
              alt="Indian cuisine preparation" 
            />
          </div>
          
          <div className="about-section">
            <h2>Our Philosophy</h2>
            <p>
              At Sunita's Khana, we believe that great food starts with great ingredients. We source only the 
              freshest spices and produce, ensuring that every dish delivers the vibrant flavors that make 
              Indian cuisine so beloved around the world.
            </p>
            <p>
              We're committed to preserving traditional cooking methods while embracing innovation. Each recipe 
              is carefully crafted to honor its origins while meeting the tastes and dietary preferences of our 
              diverse customers.
            </p>
          </div>
          
          <div className="about-section">
            <h2>From Our Kitchen to Your Table</h2>
            <p>
              Whether you're ordering our signature Butter Chicken, fragrant Biryani, or vegetarian delights like 
              Palak Paneer, you can be confident that each dish is prepared with expertise and care. We take pride 
              in delivering not just food, but an authentic dining experience that brings the rich tapestry of 
              Indian flavors right to your doorstep.
            </p>
          </div>
          
          <div className="about-values">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌿</div>
                <h3>Quality</h3>
                <p>Premium ingredients and authentic spices in every dish</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">👨‍👩‍👧‍👦</div>
                <h3>Family</h3>
                <p>Recipes passed down through generations</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">♻️</div>
                <h3>Sustainability</h3>
                <p>Eco-friendly packaging and responsible sourcing</p>
              </div>
              
              <div className="value-card">
                <div className="value-icon">❤️</div>
                <h3>Passion</h3>
                <p>Love for cooking in every bite</p>
              </div>
            </div>
          </div>
          
          <div className="about-team">
            <h2>Meet Our Team</h2>
            <p>
              Led by founder and head chef Sunita Mathias, our team brings together decades of culinary expertise. 
              Each member contributes their unique skills and passion for Indian cuisine, ensuring that every 
              dish meets our exacting standards.
            </p>
            <p>
              We're not just colleagues – we're a family united by our love for great food and our commitment 
              to sharing the rich culinary heritage of India with our community.
            </p>
          </div>
        </div>
        
        <div className="about-cta">
          <h2>Experience the Taste of Authentic India</h2>
          <p>Ready to embark on a culinary journey? Browse our menu and place your order today!</p>
          <button onClick={() => window.location.href = '/order'} className="cta-button">
            Explore Our Menu
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
