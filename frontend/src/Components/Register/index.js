import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import MessageModal from "../MessageModal";
import { useNavigate } from "react-router-dom";
import "./index.css";
import "../index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validatePassword = (password) => {
    return /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(
      password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setShowModal(false);

    if (Object.values(formData).some((value) => !value)) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setShowModal(true);
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage(
        "Password must be at least 8 characters long and include one uppercase letter, one number, and one special character."
      );
      setMessageType("error");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/users/register`,
        formData
      );
      const { message } = response.data;
      setMessage(message);
      setMessageType("success");
      setShowModal(true);
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="BgContainer">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="conatinername">Register</h1>
          <div className="rowAlign">
            <div className="FieldContainer">
              <label htmlFor="firstName" className="form-label">
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="InputField"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="FieldContainer">
              <label htmlFor="lastName" className="form-label">
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="InputField"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="rowAlign">
            <div className="FieldContainer">
              <label htmlFor="username" className="form-label">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="InputField"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="FieldContainer">
              <label htmlFor="email" className="form-label">
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="InputField"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="rowAlign">
            <div className="FieldContainer">
              <label htmlFor="phone" className="form-label">
                PHONE
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="InputField"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="FieldContainer">
              <label htmlFor="password" className="form-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="InputField"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="registerbutton">Register</button>
        </form>
      </div>
      {showModal && (
        <MessageModal
          message={message}
          type={messageType}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Register;
