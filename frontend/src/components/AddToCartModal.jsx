import React, { useState } from 'react';
import { ShoppingBag, CheckCircle, X, Plus, Minus, ShieldCheck } from 'lucide-react';
import './AddToCartModal.css';

const AddToCartModal = ({ product, isOpen, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'White');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    onConfirm(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <div className="modal-title-box">
            <ShoppingBag size={20} />
            <h3>Confirm Add to Cart</h3>
          </div>
          <button onClick={onClose} className="close-modal-btn">
            <X size={20} />
          </button>
        </div>

        <div className="cart-modal-body">
          <img src={product.image} alt={product.name} className="modal-product-img" />
          <div className="modal-product-details">
            <h4>{product.name}</h4>
            <p className="modal-product-category">{product.category.toUpperCase()} COLLECTION</p>
            <div className="modal-product-price">
              ₹{product.price.toLocaleString('en-IN')}
              {product.originalPrice > product.price && (
                <span className="modal-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="modal-option-group">
                <label>Select Size:</label>
                <div className="modal-pills">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`modal-pill ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="modal-option-group">
                <label>Select Color:</label>
                <div className="modal-pills">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`modal-pill ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Controls */}
            <div className="modal-option-group">
              <label>Quantity:</label>
              <div className="modal-qty-control">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="qty-sub-btn">
                  <Minus size={14} />
                </button>
                <span className="qty-display">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="qty-sub-btn">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cart-modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="btn btn-primary">
            <CheckCircle size={18} /> Confirm & Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
