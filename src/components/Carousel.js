import React, { useState, useEffect, useCallback } from "react";
import "../styles/Carousel.css";

const carouselData = [
  {
    image: "/images/paneerbutter.png",
    title: "Authentic Indian Cuisine",
    description: "Experience the rich flavors of traditional Indian dishes prepared with love"
  },
  {
    image: "/images/chicken.jpg",
    title: "Fresh Ingredients",
    description: "We use only the freshest ingredients to create our delicious recipes"
  },
  {
    image: "/images/neerdosa.jpg",
    title: "Regional Specialties",
    description: "Discover unique dishes from every corner of India"
  }
];

function Carousel() {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % carouselData.length);
  }, []);
  
  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  }, []);
  
  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
  };
  
  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };
  
  // Auto-play functionality
  useEffect(() => {
    let intervalId;
    
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="carousel-slides">
          {carouselData.map((slide, slideIndex) => (
            <div 
              key={slideIndex} 
              className={`carousel-slide ${slideIndex === index ? 'active' : ''}`}
              style={{ transform: `translateX(${100 * (slideIndex - index)}%)` }}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="carousel-caption">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous slide">
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <button className="carousel-control next" onClick={nextSlide} aria-label="Next slide">
          <i className="fas fa-chevron-right"></i>
        </button>
        
        <div className="carousel-indicators">
          {carouselData.map((_, slideIndex) => (
            <button 
              key={slideIndex}
              className={`carousel-indicator ${slideIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
        
        <button 
          className="carousel-autoplay-toggle" 
          onClick={toggleAutoPlay}
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
