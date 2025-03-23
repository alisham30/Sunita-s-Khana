import React, { useState } from "react";
import "../styles/Carousel.css";

const images = [
  "/images/paneerbutter.png",
  "/images/chicken.jpg",
  "/images/neerdosa.jpg"
];

function Carousel() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="carousel">
      <h2>Our Delicacies!</h2>
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <img src={images[index]} alt="Dish" />
      <button className="next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
}

export default Carousel;
