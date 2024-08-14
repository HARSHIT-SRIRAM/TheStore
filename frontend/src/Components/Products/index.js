import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getAuthDetails } from "../../utils/authUtils"; // Import the getAuthDetails function
import config from "../../config/config";
import MessageModal from "../MessageModal";
import ProductDetails from "../ProductDetails";
import Loader from "../Loader"; // Import the Loader component
import "./index.css";
import { SearchContext } from "../../Context";

const ProductDisplay = () => {
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { searchTerm, searchResults, setSearchResults } =
    useContext(SearchContext);

  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        const productsResponse = await axios.get(
          `${config.apiUrl}/product/products`
        );
        setProducts(productsResponse.data);

        const { token } = getAuthDetails();

        if (token) {
          const wishlistResponse = await axios.get(
            `${config.apiUrl}/wishlist/getuserwishlist`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlistItems(wishlistResponse.data.items.map((item) => item._id));
        } else {
          setWishlistItems([]);
        }
      } catch (err) {
        setError("Failed to fetch products or wishlist");
        setMessageType("error");
        setMessage("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        fetchProductsAndWishlist();
        return;
      }

      try {
        const response = await axios.get(`${config.apiUrl}/product/search`, {
          params: { query: searchTerm },
        });
        setSearchResults(response.data.results);
      } catch (err) {
        console.error("Search failed", err);
        setMessageType("error");
        setMessage("Search failed. Please try again.");
      }
    };

    fetchSearchResults();
  }, [searchTerm, setSearchResults]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseMessageModal = () => {
    setMessageType(null);
    setMessage("");
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
  };

  const addToCart = async (product, quantity) => {
    const { token, userId } = getAuthDetails();

    if (!token) {
      setMessageType("error");
      setMessage("Please login first");
      return;
    }

    try {
      await axios.post(
        `${config.apiUrl}/cart/cartUpdate`,
        {
          userId,
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessageType("success");
      setMessage("Product added to cart.");
    } catch (err) {
      setMessageType("error");
      setMessage("Failed to add product to cart.");
    }
  };

  const addToWishlist = async (product) => {
    const { token, userId } = getAuthDetails();

    if (!token) {
      setMessageType("error");
      setMessage("Please login first");
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/wishlist/wishlistUpdate`,
        {
          userId,
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message.includes("added to wishlist")) {
        setWishlistItems((prevItems) => [...prevItems, product._id]);
      } else if (response.data.message.includes("removed from wishlist")) {
        setWishlistItems((prevItems) =>
          prevItems.filter((id) => id !== product._id)
        );
      }

      setMessageType("success");
      setMessage(response.data.message);
    } catch (err) {
      setMessageType("error");
      setMessage("Failed to update wishlist.");
    }
  };

  if (loading) return <Loader />; // Display Loader while loading

  if (error) return <p>{error}</p>;

  const displayedProducts = searchTerm ? searchResults : products;

  return (
    <div className="product-display">
      <div className="product-cards">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="productimage"
              />
              <h2>{product.name}</h2>
              <p className="price">${product.price.toFixed(2)}</p>
              <p className="description">{product.description}</p>
              <div className="addwishlist">
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  View Details
                </button>
                <i
                  className={`bi bi-heart-fill Heart ${
                    wishlistItems.includes(product._id) ? "wishlisted" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(product);
                  }}
                ></i>
              </div>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseProductDetails}
          onAddToCart={(quantity) => addToCart(selectedProduct, quantity)}
          wishlistItems={wishlistItems}
          addToWishlist={addToWishlist}
        />
      )}
      {messageType && (
        <MessageModal
          messageType={messageType}
          message={message}
          onClose={handleCloseMessageModal}
        />
      )}
    </div>
  );
};

export default ProductDisplay;
