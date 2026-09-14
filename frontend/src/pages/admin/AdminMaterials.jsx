import React, { useState, useEffect } from 'react';
import { getMaterialsApi, createMaterialApi, updateMaterialApi, deleteMaterialApi } from '../../services/api';
import { Plus, Edit2, Trash2, X, Scissors } from 'lucide-react';

const AdminMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    fabricType: '',
    category: 'shirt',
    pricePerMeter: 650,
    baseStitchingPrice: 499,
    description: '',
    image: '',
    availableColors: 'Pure White, Silver Grey, Charcoal',
    patterns: 'Solid, Pinstripe, Checkered',
    inStock: true,
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data } = await getMaterialsApi({ category: 'all' });
      setMaterials(data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      fabricType: '',
      category: 'shirt',
      pricePerMeter: 650,
      baseStitchingPrice: 499,
      description: '',
      image: '',
      availableColors: 'Pure White, Silver Grey, Charcoal',
      patterns: 'Solid, Pinstripe, Checkered',
      inStock: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (mat) => {
    setEditingId(mat._id);
    setFormData({
      name: mat.name,
      fabricType: mat.fabricType,
      category: mat.category,
      pricePerMeter: mat.pricePerMeter,
      baseStitchingPrice: mat.baseStitchingPrice,
      description: mat.description,
      image: mat.image,
      availableColors: mat.availableColors.join(', '),
      patterns: mat.patterns.join(', '),
      inStock: mat.inStock,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this fabric from customization inventory?')) {
      try {
        await deleteMaterialApi(id);
        fetchMaterials();
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
        pricePerMeter: Number(formData.pricePerMeter),
        baseStitchingPrice: Number(formData.baseStitchingPrice),
        availableColors: formData.availableColors.split(',').map((c) => c.trim()),
        patterns: formData.patterns.split(',').map((p) => p.trim()),
      };

      if (editingId) {
        await updateMaterialApi(editingId, payload);
      } else {
        await createMaterialApi(payload);
      }

      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      console.error('Material save error:', err);
      alert('Failed to save material details.');
    }
  };

  return (
    <div className="admin-materials">
      <div className="flex-between margin-bottom-md">
        <div>
          <h2>Custom Tailoring Cloth & Material Inventory</h2>
          <p className="text-muted">Manage fabrics, stitching costs, and color options available in Custom Studio.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={18} /> Add Custom Cloth Fabric
        </button>
      </div>

      {loading ? (
        <div className="loading-container">Loading materials...</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sample</th>
                <th>Material Name</th>
                <th>Fabric Type</th>
                <th>Target Category</th>
                <th>Price/Meter</th>
                <th>Stitching Fee</th>
                <th>In Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((mat) => (
                <tr key={mat._id}>
                  <td>
                    <img src={mat.image} alt={mat.name} className="table-thumb" />
                  </td>
                  <td>
                    <strong>{mat.name}</strong>
                  </td>
                  <td>{mat.fabricType}</td>
                  <td>
                    <span className="badge badge-user">{mat.category.toUpperCase()}</span>
                  </td>
                  <td>₹{mat.pricePerMeter}/m</td>
                  <td>₹{mat.baseStitchingPrice}</td>
                  <td>{mat.inStock ? 'Available' : 'Out of Stock'}</td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => handleOpenEditModal(mat)} className="icon-btn-sm" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(mat._id)} className="icon-btn-sm delete" title="Delete">
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card animate-fade-in">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Fabric Material' : 'Add Custom Tailoring Cloth'}</h3>
              <button onClick={() => setShowModal(false)} className="icon-btn-sm"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Material Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Supima Extra-Long Staple Cotton"
                  required
                />
              </div>

              <div className="form-row-2 margin-top-sm">
                <div className="form-group">
                  <label>Fabric Type *</label>
                  <input
                    type="text"
                    value={formData.fabricType}
                    onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                    placeholder="Cotton / Linen / Wool"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Garment Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="shirt">Shirt</option>
                    <option value="pant">Pant / Trouser</option>
                    <option value="t-shirt">T-Shirt</option>
                    <option value="all">All Garments</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 margin-top-sm">
                <div className="form-group">
                  <label>Price Per Meter (₹) *</label>
                  <input
                    type="number"
                    value={formData.pricePerMeter}
                    onChange={(e) => setFormData({ ...formData, pricePerMeter: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Master Stitching Fee (₹) *</label>
                  <input
                    type="number"
                    value={formData.baseStitchingPrice}
                    onChange={(e) => setFormData({ ...formData, baseStitchingPrice: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Fabric Preview Image URL *</label>
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
                  <label>Colors Available (comma separated)</label>
                  <input
                    type="text"
                    value={formData.availableColors}
                    onChange={(e) => setFormData({ ...formData, availableColors: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Patterns / Weaves (comma separated)</label>
                  <input
                    type="text"
                    value={formData.patterns}
                    onChange={(e) => setFormData({ ...formData, patterns: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-actions margin-top-md flex-between">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Fabric Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaterials;
