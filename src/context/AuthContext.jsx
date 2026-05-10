import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ic_plus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('ic_plus_token'));
  const [loading, setLoading] = useState(true);

  // Listen for unauthorized events from api.js to auto-logout
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  // Fetch full profile if token exists on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const data = await api.get('/auth/me');
          setUser(data.data); // data.data contains UserProfileResponse
          localStorage.setItem('ic_plus_user', JSON.stringify(data.data));
        } catch (error) {
          console.error("Failed to load profile:", error.message);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    
    setToken(token);
    setUser(user);
    localStorage.setItem('ic_plus_token', token);
    localStorage.setItem('ic_plus_user', JSON.stringify(user));
    
    return user; // Return user so login page knows where to redirect
  };

  const register = async (userData) => {
    // Expected userData: email, password, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_wa, golongan_darah
    await api.post('/auth/register', userData);
    // After register, auto login
    return login(userData.email, userData.password);
  };

  const logout = async () => {
    try {
      if (token) await api.post('/auth/logout');
    } catch (e) {
      // Ignore if logout fails on server
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('ic_plus_token');
      localStorage.removeItem('ic_plus_user');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
