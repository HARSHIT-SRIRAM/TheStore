import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthDetails } from "../../utils/authUtils";
import config from "../../config/config";
import MessageModal from "../MessageModal";
import Loader from "../Loader";
import "./index.css";

const AddressManagement = ({ address, closeContainer }) => {
  const [apartment, setApartment] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setApartment(address.apartment || "");
      setStreet(address.street || "");
      setCity(address.city || "");
      setState(address.state || "");
      setPostalCode(address.postalcode || "");
      setCountry(address.country || "");
    } else {
      setApartment("");
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
    }
  }, [address]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode || !country) {
      setMessageType("error");
      setMessage("Please fill in all fields.");
      return;
    }

    const updatedAddress = {
      apartment,
      street,
      city,
      state,
      postalcode: postalCode,
      country,
    };

    const { token } = getAuthDetails();

    if (!token) {
      setMessageType("error");
      setMessage("No token found, please relogin");
      return;
    }

    setLoading(true);

    try {
      if (address) {
        await axios.put(
          `${config.apiUrl}/users/profile/address/${address._id}`,
          { address: updatedAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${config.apiUrl}/users/profile/addresses`,
          { address: updatedAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setMessageType("success");
      setMessage("Address saved successfully.");

      setTimeout(() => {
        closeContainer();
        window.location.reload();
      }, 1000);
    } catch (err) {
      setMessageType("error");
      setMessage("Error saving address.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessageModal = () => {
    setMessageType(null);
    setMessage("");
  };

  return (
    <div className="address-management-overlay">
      <div className="address-management-container">
        <h2 className="containername">
          {address ? "Edit Address" : "Add Address"}
        </h2>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={handleSave}>
            <div>
              <label className="form-label">Apartment:</label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="InputField"
              />
            </div>
            <div>
              <label className="form-label">Street:</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="InputField"
              />
            </div>
            <div>
              <label className="form-label">City:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="InputField"
              />
            </div>
            <div>
              <label className="form-label">State:</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="InputField"
              />
            </div>
            <div>
              <label className="form-label">Postal Code:</label>
              <input
                type="number"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="InputField"
              />
            </div>
            <div>
              <label className="form-label">Country:</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="InputField"
              />
            </div>
            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={closeContainer} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {messageType && (
          <MessageModal
            messageType={messageType}
            message={message}
            onClose={handleCloseMessageModal}
          />
        )}
      </div>
    </div>
  );
};

export default AddressManagement;
