import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import "./index.css";
import { getAuthDetails } from "../../utils/authUtils";

const ProfileEdit = ({ user, closeContainer, updateUserProfile }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token } = getAuthDetails();
      await axios.put(`${config.apiUrl}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage("Profile updated successfully!");
      updateUserProfile();
      setTimeout(() => {
        setSuccessMessage("");
        closeContainer();
      }, 2000);
    } catch (err) {
      setError("Error updating profile.");
      console.error(err);
    }
  };

  return (
    <div className="BgContainer">
      <h2 className="containername">Edit Profile</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="FieldContainer">
          <label className="form-label">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="InputField"
            required
          />
        </div>
        <div className="FieldContainer">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="InputField"
            required
          />
        </div>
        <div className="FieldContainer">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="InputField"
            required
          />
        </div>
        <div className="FieldContainer">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="InputField"
            required
          />
        </div>
        <div className="FieldContainer">
          <label className="form-label">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="InputField"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-button">
            Save
          </button>
          <button
            type="button"
            onClick={closeContainer}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
