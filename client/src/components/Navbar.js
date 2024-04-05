import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import "../styling/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const refreshPage = () => {
    if (location.pathname === "/") {
      window.location.reload(false);
    }
  };

  return (
    <nav>
      <NavLink to="/" className="header" onClick={refreshPage}>
        <i className="fas fa-home"></i> Home
      </NavLink>
      <ul className="navbar-links" style={{ width: "35%" }}>
        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            <i className="far fa-registered" /> Registration
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
