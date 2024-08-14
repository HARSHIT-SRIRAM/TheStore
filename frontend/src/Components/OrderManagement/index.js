import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthDetails } from "../../utils/authUtils";
import config from "../../config/config";
import MessageModal from "../MessageModal";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import "./index.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { token } = getAuthDetails();

        if (!token) {
          setMessageType("info");
          setMessage("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.apiUrl}/orders/getOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders");
        setMessageType("error");
        setMessage(err.response?.data?.error || "Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to cancel orders.");
        return;
      }

      await axios.post(
        `${config.apiUrl}/orders/cancelOrder`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      window.location.reload();
      setMessageType("success");
      setMessage("Order canceled successfully.");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.error || "Failed to cancel order.");
    }
  };

  const toggleOrderItems = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleCloseModal = () => {
    if (messageType === "info") {
      navigate("/");
    }
    setMessageType(null);
  };

  if (loading) return <Loader />;

  if (error) return <p>{error}</p>;

  return (
    <div className="order-management">
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <h2>Order ID: {order._id}</h2>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              {expandedOrderId === order._id ? (
                <>
                  <button
                    className="toggle-items-button"
                    onClick={() => toggleOrderItems(order._id)}
                  >
                    Hide Items
                  </button>
                  <h3>Items:</h3>
                  <ul className="order-items">
                    {order.items.map((item) => (
                      <li
                        key={item.productId._id}
                        className="order-item-detail"
                      >
                        <img
                          src={item.productId.imageUrl}
                          alt={item.productId.name}
                          className="order-item-image"
                        />
                        <div className="order-item-info">
                          <h4>{item.productId.name}</h4>
                          <p>Price: ${item.productId.price.toFixed(2)}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <button
                  className="toggle-items-button"
                  onClick={() => toggleOrderItems(order._id)}
                >
                  Show Items
                </button>
              )}
              {order.status !== "Cancelled" && (
                <button
                  className="cancel-order-button"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders.</p>
      )}
      {messageType && (
        <MessageModal
          messageType={messageType}
          message={message}
          onClose={handleCloseModal} // Pass handleCloseModal to MessageModal
        />
      )}
    </div>
  );
};

export default OrderManagement;
