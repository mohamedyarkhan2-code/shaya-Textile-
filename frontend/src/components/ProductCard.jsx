import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import AddToCartModal from './AddToCartModal';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (prod, size, color, qty) => {
    addToCart(prod, size, color, qty);
  };

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="product-card">
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} className="product-img" />
          <div className="product-badges">
            <span className="badge-cat">{product.category.toUpperCase()}</span>
            {discountPercent > 0 && <span className="badge-discount">-{discountPercent}%</span>}
          </div>
          <div className="product-overlay-actions">
            <button onClick={handleOpenConfirm} className="action-btn add-btn" title="Add to Cart">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        <div className="product-info">
          <div className="product-rating">
            <Star size={14} className="star-icon" />
            <span>{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>

          <span className="product-title">
            {product.name}
          </span>

          <p className="product-short-desc">{product.description.substring(0, 65)}...</p>

          <div className="product-bottom flex-between">
            <div className="price-box">
              <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <button onClick={handleOpenConfirm} className="btn btn-secondary btn-sm">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAdd}
      />
    </>
  );
};

export default ProductCard;
