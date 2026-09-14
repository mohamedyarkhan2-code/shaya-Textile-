import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi, updateLocationApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('shaya_token') || '');
  const [loading, setLoading] = useState(true);

  // Attempt to fetch current user profile on load if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const { data } = await getProfileApi();
          setUser(data);
          // Try capturing browser geolocation silently to update admin view
          captureUserLocation();
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const captureUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await updateLocationApi({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } catch (err) {
            console.log('Location sync skipped or denied');
          }
        },
        (error) => {
          console.log('Geolocation permission skipped:', error.message);
        }
      );
    }
  };

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem('shaya_token', data.token);
    setToken(data.token);
    setUser(data);
    captureUserLocation();
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerApi(userData);
    localStorage.setItem('shaya_token', data.token);
    setToken(data.token);
    setUser(data);
    captureUserLocation();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shaya_token');
    setToken('');
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
