import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import '../styles/Products.css';

const Products = () => {
  const { addToCart } = useCart();
  
  // Sample products data (in a real app, this would come from an API)
  const products = [
    {
      _id: 'p1',
      name: 'Masala Spice Box',
      price: 599,
      image: '/images/products/masala-box.jpg',
      description: 'Traditional Indian spice box with 7 essential spices for authentic cooking.',
      category: 'Kitchen Essentials'
    },
    {
      _id: 'p2',
      name: 'Copper Thali Set',
      price: 1299,
      image: '/images/products/thali.jpg',
      description: 'Traditional copper thali set with 6 bowls, perfect for serving Indian meals.',
      category: 'Dining'
    },
    {
      _id: 'p3',
      name: 'Tandoor Clay Pot',
      price: 1499,
      image: '/images/products/tandoor.jpg',
      description: 'Home tandoor clay pot for making authentic naan, roti and tandoori dishes.',
      category: 'Cookware'
    },
    {
      _id: 'p4',
      name: 'Sunita\'s Special Curry Powder',
      price: 299,
      image: '/images/products/curry-powder.jpg',
      description: 'Our signature blend of spices for making perfect curries every time.',
      category: 'Spices'
    },
    {
      _id: 'p5',
      name: 'Brass Diya Set',
      price: 499,
      image: '/images/products/diya.jpg',
      description: 'Set of 5 traditional brass diyas for festivals and home decoration.',
      category: 'Home Decor'
    },
    {
      _id: 'p6',
      name: 'Sunita\'s Cookbook',
      price: 799,
      image: '/images/products/cookbook.jpg',
      description: 'Collection of 100+ authentic Indian recipes with step-by-step instructions.',
      category: 'Books'
    },
    {
      _id: 'p7',
      name: 'Chai Tea Set',
      price: 899,
      image: '/images/products/chai-set.jpg',
      description: 'Complete chai tea set with kettle, strainer, and 4 traditional cups.',
      category: 'Beverages'
    },
    {
      _id: 'p8',
      name: 'Handcrafted Wooden Spoons',
      price: 399,
      image: '/images/products/wooden-spoons.jpg',
      description: 'Set of 5 handcrafted wooden spoons for cooking Indian dishes.',
      category: 'Kitchen Essentials'
    }
  ];

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-page">
      <Navbar />
      
      <div className="products-container">
        <h1>Shop Our Products</h1>
        <p className="products-intro">
          Discover our collection of authentic Indian cooking essentials, kitchenware, and specialty items 
          to enhance your culinary experience.
        </p>

        {Object.keys(groupedProducts).map(category => (
          <div key={category} className="product-category">
            <h2>{category}</h2>
            <div className="products-grid">
              {groupedProducts[category].map(product => (
                <div className="product-card" key={product._id}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">₹{product.price}</div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
