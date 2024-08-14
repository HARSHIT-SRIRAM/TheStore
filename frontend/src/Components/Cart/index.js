import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthDetails } from "../../utils/authUtils";
import config from "../../config/config";
import MessageModal from "../MessageModal";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

import "./index.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const fetchCart = async () => {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${config.apiUrl}/cart/getcart/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.items);
      } catch (err) {
        setError("Failed to fetch cart items");
        setMessageType("error");
        setMessage(err.response?.data?.error || "Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to update cart items.");
        return;
      }

      if (quantity < 1) return;
      const productInStock = cartItems.find(
        (item) => item.productId._id === productId
      ).productId.stock;

      if (quantity > productInStock) {
        setMessageType("error");
        setMessage("Quantity exceeds stock.");
        return;
      }

      await axios.post(
        `${config.apiUrl}/cart/cartUpdate`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.error || "Failed to update quantity.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to remove items from the cart.");
        return;
      }

      await axios.delete(`${config.apiUrl}/cart/removeItem`, {
        data: { productId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
      setMessageType("success");
      setMessage("Product removed from cart.");
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.error || "Failed to remove product from cart."
      );
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to place an order.");
        return;
      }

      const totalPrice = calculateTotalPrice();

      await axios.post(
        `${config.apiUrl}/orders/placeOrder`,
        {
          cartItems,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await axios.post(
        `${config.apiUrl}/cart/clearCart`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems([]);
      setMessageType("success");
      setMessage("Order placed successfully.");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.error || "Failed to place order.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <ul className="cart-items-list">
            {cartItems.map((item) => (
              <li key={item.productId._id} className="cart-item">
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h2>{item.productId.name}</h2>
                  <p>Price: ${item.productId.price.toFixed(2)}</p>
                  <p>Stock: {item.productId.stock}</p>
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="quantity-input"
                    />
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= item.productId.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item-button"
                    onClick={() => handleRemoveFromCart(item.productId._id)}
                  >
                    Remove from Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Total Price: ${calculateTotalPrice()}</h2>
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {messageType && (
        <MessageModal
          messageType={messageType}
          message={message}
          onClose={() => {
            setMessageType(null);
            setMessage("");
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default Cart;
