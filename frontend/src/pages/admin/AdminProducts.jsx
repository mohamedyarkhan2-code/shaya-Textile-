import React, { useState, useEffect } from 'react';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../../services/api';
import { Plus, Edit2, Trash2, X, Package } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'shirt',
    price: '',
    originalPrice: '',
    image: '',
    sizes: 'S, M, L, XL, XXL',
    colors: 'White, Grey, Black',
    stock: 50,
    isFeatured: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProductsApi({ category: 'all' });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      category: 'shirt',
      price: '',
      originalPrice: '',
      image: '',
      sizes: 'S, M, L, XL, XXL',
      colors: 'White, Grey, Black',
      stock: 50,
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      image: prod.image,
      sizes: prod.sizes.join(', '),
      colors: prod.colors.join(', '),
      stock: prod.stock,
      isFeatured: prod.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id);
        fetchProducts();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock: Number(formData.stock),
        sizes: formData.sizes.split(',').map((s) => s.trim()),
        colors: formData.colors.split(',').map((c) => c.trim()),
      };

      if (editingId) {
        await updateProductApi(editingId, payload);
      } else {
        await createProductApi(payload);
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save product details.');
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-action-banner margin-bottom-md">
        <div>
          <h2>Ready-Made Apparel Inventory</h2>
          <p className="text-muted">Manage ready-to-ship Shirts, Pants, and T-Shirts in your catalog.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary btn-lg action-add-btn">
          <Plus size={20} /> Add Ready-Made Product
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Loading inventory...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id}>
                  <td>
                    <img src={prod.image} alt={prod.name} className="table-thumb" />
                  </td>
                  <td>
                    <strong>{prod.name}</strong>
                    <br />
                    <small className="text-muted">{prod.description.substring(0, 50)}...</small>
                  </td>
                  <td>
                    <span className="badge badge-user">{prod.category.toUpperCase()}</span>
                  </td>
                  <td>₹{prod.price}</td>
                  <td>{prod.stock} pcs</td>
                  <td>{prod.isFeatured ? 'YES ★' : 'No'}</td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => handleOpenEditModal(prod)} className="icon-btn-sm" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(prod._id)} className="icon-btn-sm delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card animate-fade-in">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Product' : 'Add Ready-Made Garment'}</h3>
              <button onClick={() => setShowModal(false)} className="icon-btn-sm"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Executive Grey Oxford Shirt"
                  required
                />
              </div>

              <div className="form-row-2 margin-top-sm">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="shirt">Shirt</option>
                    <option value="pant">Pant / Trouser</option>
                    <option value="t-shirt">T-Shirt</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-2 margin-top-sm">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1899"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (MRP) (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="2499"
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Image URL *</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="form-row-2 margin-top-sm">
                <div className="form-group">
                  <label>Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Colors (comma separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group margin-top-sm">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured on Home Page
                </label>
              </div>

              <div className="modal-actions margin-top-md flex-between">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
