import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "../styling/Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <NavLink to="/" className="header">
        <i className="fas fa-home"></i> Home
      </NavLink>
      <ul
        className="navbar-links"
        style={{ width: "35%"}}
      >
        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            <i className="far fa-registered" /> Registration
          </NavLink>
        </li>
        <li>
          <NavLink to="/Voting" activeClassName="nav-active">
            <i className="fas fa-vote-yea" /> Voting
          </NavLink>
        </li>
        <li>
          <NavLink to="/Results" activeClassName="nav-active">
            <i className="fas fa-poll-h" /> Results
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}