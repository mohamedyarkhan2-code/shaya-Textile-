import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('shaya_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear token if expired or invalid
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const loginApi = (data) => API.post('/auth/login', data);
export const registerApi = (data) => API.post('/auth/register', data);
export const getProfileApi = () => API.get('/auth/profile');
export const updateProfileApi = (data) => API.put('/auth/profile', data);
export const updateLocationApi = (data) => API.put('/auth/location', data);
export const getAllUsersApi = () => API.get('/auth/users');

// Product Services
export const getProductsApi = (params) => API.get('/products', { params });
export const getProductByIdApi = (id) => API.get(`/products/${id}`);
export const createProductApi = (data) => API.post('/products', data);
export const updateProductApi = (id, data) => API.put(`/products/${id}`, data);
export const deleteProductApi = (id) => API.delete(`/products/${id}`);

// Material Services
export const getMaterialsApi = (params) => API.get('/materials', { params });
export const getMaterialByIdApi = (id) => API.get(`/materials/${id}`);
export const createMaterialApi = (data) => API.post('/materials', data);
export const updateMaterialApi = (id, data) => API.put(`/materials/${id}`, data);
export const deleteMaterialApi = (id) => API.delete(`/materials/${id}`);

// Order Services
export const createOrderApi = (data) => API.post('/orders', data);
export const getMyOrdersApi = () => API.get('/orders/myorders');
export const getOrderByIdApi = (id) => API.get(`/orders/${id}`);
export const getAllOrdersApi = () => API.get('/orders');
export const updateOrderStatusApi = (id, data) => API.put(`/orders/${id}/status`, data);

export default API;
