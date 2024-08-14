import React, { useState } from "react";
import "./index.css";

const ProductDetails = ({
  product,
  onClose,
  onAddToCart,
  wishlistItems,
  addToWishlist,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const renderDetails = () => {
    if (!product.details || Object.keys(product.details).length === 0)
      return null;

    return Object.entries(product.details).map(([key, value]) => {
      let displayValue;

      if (typeof value === "boolean") {
        displayValue = value ? "Yes" : "No";
      } else if (typeof value === "object" && value !== null) {
        displayValue = JSON.stringify(value, null, 2);
      } else {
        displayValue = value;
      }

      return (
        <p key={key}>
          <strong>{capitalizeFirstLetter(key)}:</strong> {displayValue}
        </p>
      );
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = Number(event.target.value);
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  const isInWishlist = wishlistItems.includes(product._id);

  return (
    <div className="product-details-overlay">
      <div className="FullProduct">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="topConatiner">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
          />
          <div className="About">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Stock: {product.stock}</p>
            <p className="price">${product.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button
                className="quantity-button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={product.stock}
                onChange={handleQuantityChange}
              />
              <button
                className="quantity-button"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <div className="productsalignbtn">
              <button
                className="add-to-cart-btn productaddbtn"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
              <i
                className={`bi bi-heart-fill Heart ${
                  isInWishlist ? "wishlisted" : ""
                }`}
                onClick={() => addToWishlist(product)}
              ></i>
            </div>
          </div>
        </div>
        <div className="detailsReviwesConnatiner">
          <div className="Subdetails">
            <h3>Details:</h3>
            {renderDetails()}
          </div>
          <div className="product-reviews">
            <h3>Reviews:</h3>
            {product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="review">
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating}
                  </p>
                  <p>
                    <strong>Rated On:</strong>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
