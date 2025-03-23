import React from "react";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Card from "./components/Card";
import Footer from "./components/Footer";
import "./styles/Navbar.css";
import "./styles/Carousel.css";
import "./styles/Card.css";
import "./styles/Footer.css";

const cardData = [
  { id: 1, title: "Paneer Butter Masala", description: "Rich and creamy paneer butter masala cooked with love.", image: "/images/paneerbutter.png" },
  { id: 2, title: "Aloo Paratha", description: "Soft and stuffed Aloo Paratha served with fresh curd and pickles.", image: "/images/aloo.jpeg" },
  { id: 3, title: "Rajma Chawal", description: "Perfectly spiced Rajma with hot steamed rice, a true comfort meal.", image: "/images/rajma.jpeg" },
  { id: 4, title: "Butter Chicken", description: "Authentic butter chicken with creamy tomato-based gravy.", image: "/images/butterchicken.jpeg" },
  { id: 5, title: "Mangalorean Fish Curry", description: "Spicy and tangy fish curry, a Mangalorean delicacy.", image: "/images/fishcurry.jpeg" },
  { id: 6, title: "Neer Dosa", description: "Soft and delicate Mangalorean rice crepes.", image: "/images/neerdosa.jpeg" },
];

function App() {
  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="card-container">
        {cardData.map((card) => <Card key={card.id} {...card} />)}
      </div>
       <Footer/>
    </div>
  );
}

export default App;
