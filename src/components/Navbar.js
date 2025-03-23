import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/images/logof.png" alt="Sunita's Khana" />
      </div>
      <ul className="nav-links">
        <li><a>Home</a></li>
        <li><a>Menu</a></li>
        <li><a>About</a></li>
        <li><a>Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
