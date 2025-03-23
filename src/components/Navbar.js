import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/images/logof.png" alt="Sunita's Khana" />
      </div>
      <ul className="nav-links">
        <li><p>Home</p></li>
        <li><p>Menu</p></li>
        <li><p>About</p></li>
        <li><p>Contact</p></li>
      </ul>
    </nav>
  );
}

export default Navbar;
