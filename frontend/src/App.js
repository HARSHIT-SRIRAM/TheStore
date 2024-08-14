import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Cart from "./Components/Cart";
import UserProfile from "./Components/UserProfile";
import OrderManagement from "./Components/OrderManagement";
import Products from "./Components/Products";
import NotFound from "./Components/NotFound";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
