import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import './Shop.css';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProductsApi({
        category: selectedCategory !== 'all' ? selectedCategory : '',
        search: searchQuery,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="shop-page container">
      <div className="shop-header">
        <h1>Ready-Made Apparel Collection</h1>
        <p>Premium off-the-rack Shirts, Pants, and T-Shirts ready for instant dispatch.</p>
      </div>

      <div className="shop-controls">
        {/* Category Tabs */}
        <div className="category-pills">
          {['all', 'shirt', 'pant', 't-shirt'].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat === 'all' ? 'All Products' : cat === 'shirt' ? 'Shirts' : cat === 'pant' ? 'Pants & Trousers' : 'T-Shirts'}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="shop-search-form">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search ready-made garments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ready-made catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-catalog">
          <h3>No products found</h3>
          <p>Try clearing filters or search for another term.</p>
        </div>
      ) : (
        <div className="shop-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
