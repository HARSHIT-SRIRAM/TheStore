import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuthDetails } from "../../utils/authUtils";
import config from "../../config/config";
import AddressManagement from "../Address";
import ProfileEdit from "../ProfileEdit";
import Loader from "../Loader";
import MessageModal from "../MessageModal";
import "./index.css";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editOrAddAddressContainer, setEditOrAddAddressContainer] =
    useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [wishlistedItems, setWishlistedItems] = useState([]);
  const [error, setError] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { token } = getAuthDetails();

      if (!token) {
        setMessageType("info");
        setMessage("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const [profileResponse, wishlistResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/users/profile/profileDetails`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${config.apiUrl}/wishlist/getuserwishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserDetails(profileResponse.data);
        setWishlistedItems(wishlistResponse.data.items);
      } catch (err) {
        setError("Error fetching user details.");
        setMessageType("error");
        setMessage(err.response?.data?.error || "Error fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditClick = (event, address) => {
    event.preventDefault();
    setSelectedAddress(address);
    setEditOrAddAddressContainer(true);
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    setSelectedAddress(null);
    setEditOrAddAddressContainer(true);
  };

  const closeAddressManagement = () => {
    setEditOrAddAddressContainer(false);
    setSelectedAddress(null);
  };

  const handleDelete = async (addressId) => {
    try {
      const { token } = getAuthDetails();
      await axios.delete(
        `${config.apiUrl}/users/profile/address/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(
        `${config.apiUrl}/users/profile/profileDetails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserDetails(response.data);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.error || "Error deleting address.");
    }
  };

  const handleProfileEditClick = () => {
    setEditProfile(true);
  };

  const closeProfileEdit = () => {
    setEditProfile(false);
  };

  const removeWishlist = async (productId) => {
    try {
      const { token } = getAuthDetails();
      await axios.post(
        `${config.apiUrl}/wishlist/wishlistUpdate`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlistedItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );
    } catch (err) {
      setMessageType("error");
      setMessage(
        err.response?.data?.error || "Error removing item from wishlist."
      );
    }
  };

  if (loading) return <Loader />;

  if (error) return <p>{error}</p>;

  return (
    <div className="card-container">
      <div className="cards profileDetails">
        <div className="profileedit">
          <h1>User Profile</h1>
          <button className="profileeditbtn" onClick={handleProfileEditClick}>
            Edit
          </button>
        </div>
        {userDetails ? (
          <>
            <p>
              <strong className="makingstrong">Username:</strong>{" "}
              {userDetails.username}
            </p>
            <p>
              <strong className="makingstrong">Email:</strong>{" "}
              {userDetails.email}
            </p>
            <p>
              <strong className="makingstrong">First Name:</strong>{" "}
              {userDetails.firstName}
            </p>
            <p>
              <strong className="makingstrong">Last Name:</strong>{" "}
              {userDetails.lastName}
            </p>
            <p>
              <strong className="makingstrong">Phone:</strong>{" "}
              {userDetails.phone}
            </p>
            <p>
              <strong className="makingstrong">Account Type:</strong>{" "}
              {userDetails.accountType}
            </p>
            <p>
              <strong className="makingstrong">Created At:</strong>{" "}
              {new Date(userDetails.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong className="makingstrong">Updated At:</strong>{" "}
              {new Date(userDetails.updatedAt).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p>No user details available.</p>
        )}
      </div>

      <div className="cards addressscard">
        <div className="addressadd">
          <h1>Addresses</h1>
          <button className="addressaddbtn" onClick={handleAddClick}>
            Add
          </button>
        </div>
        {userDetails && userDetails.addresses ? (
          <ul className="addressesContainer">
            {userDetails.addresses.map((address) => (
              <li key={address._id} className="addressCard">
                <div>
                  <p className="address-part">Apartment: {address.apartment}</p>
                  <p className="address-part">Street: {address.street}</p>
                  <p className="address-part">City: {address.city}</p>
                  <p className="address-part">State: {address.state}</p>
                  <p className="address-part">
                    Postal Code: {address.postalcode}
                  </p>
                  <p className="address-part">Country: {address.country}</p>
                  <button
                    className="addresseditbtn"
                    onClick={(event) => handleEditClick(event, address)}
                  >
                    Edit
                  </button>
                  <button
                    className="addresseditbtn"
                    onClick={() => handleDelete(address._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No addresses available.</p>
        )}
      </div>

      <div className="cards">
        <h1>Wishlisted Items</h1>
        {wishlistedItems.length > 0 ? (
          <ul className="wishlisted-items-container">
            {wishlistedItems.map((item) => (
              <li key={item._id} className="wishlisted-item">
                <div className="wishlisted-item-heart-container">
                  <i
                    className={`bi bi-heart-fill Heart ${
                      wishlistedItems.some((w) => w._id === item._id)
                        ? "wishlisted"
                        : ""
                    }`}
                    onClick={() => removeWishlist(item._id)}
                  ></i>
                </div>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="wishlisted-item-image"
                />
                <div className="wishlisted-item-details">
                  <h2 className="wishlisted-item-title">{item.name}</h2>
                  <p className="wishlisted-item-description">
                    {item.description}
                  </p>
                  <p className="wishlisted-item-price">
                    Price: ${item.price.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-wishlist-message">No items in your wishlist.</p>
        )}
      </div>

      {editProfile && (
        <div className="profile-edit-overlay">
          <ProfileEdit
            user={userDetails}
            closeContainer={closeProfileEdit}
            updateUserProfile={() => window.location.reload()}
          />
        </div>
      )}

      {editOrAddAddressContainer && (
        <div className="address-management-overlay">
          <AddressManagement
            address={selectedAddress}
            closeContainer={closeAddressManagement}
          />
        </div>
      )}

      {messageType && (
        <MessageModal
          messageType={messageType}
          message={message}
          onClose={() => {
            setMessageType(null);
            setMessage("");
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;
