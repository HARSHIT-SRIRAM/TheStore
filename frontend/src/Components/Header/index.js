import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import MessageModal from "../MessageModal";
import { SearchContext } from "../../Context";
import "./index.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginLogoutClick = async () => {
    if (isLoggedIn) {
      setLoading(true);
      try {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setModalMessage("Logout successful!");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 1000);
      } catch (error) {
        setError("Logout failed");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 1000);
      } finally {
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  const handleHomeClick = () => {
    navigate("/products");
    window.location.reload();
  };

  return (
    <header className="Header">
      <nav className="logo-nav">
        <Link to="/" className="site-logo">
          TheStore
        </Link>
      </nav>
      <nav className="components-nav" tabIndex="0">
        <i className="bi bi-search"></i>

        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          ref={inputRef}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <Link to="/" className="nav-links" onClick={handleHomeClick}>
          <i className="bi bi-house"></i>
          Home
        </Link>
        <Link to="/profile" className="nav-links">
          <i className="bi bi-person"></i>
          Profile
        </Link>
        <Link to="/cart" className="nav-links">
          <i className="bi bi-cart"></i>
          Cart
        </Link>
        <Link to="/orders" className="nav-links">
          <i className="bi bi-card-list"></i>
          Orders
        </Link>
        <button
          className="nav-links logoutbutton"
          onClick={handleLoginLogoutClick}
          aria-label={isLoggedIn ? "Logout" : "Login"}
          disabled={loading}
        >
          <i
            className={`bi ${
              isLoggedIn ? "bi-box-arrow-right" : "bi-box-arrow-in-left"
            }`}
          ></i>
          {loading ? "Loading..." : isLoggedIn ? "Logout" : "Login"}
        </button>
      </nav>
      {showModal && (
        <MessageModal
          message={error || modalMessage}
          type={error ? "error" : "success"}
          onClose={() => setShowModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
