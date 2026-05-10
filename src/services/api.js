const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const IS_NGROK = API_BASE_URL.includes('ngrok');

/**
 * A wrapper around native fetch to automatically include the JWT token
 * and parse JSON responses.
 */
async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem('ic_plus_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(IS_NGROK ? { 'ngrok-skip-browser-warning': 'true' } : {}),
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  let data;

  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized: Clear token if invalid
      localStorage.removeItem('ic_plus_token');
      localStorage.removeItem('ic_plus_user');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    
    const errorMsg = data?.message || data?.error || 'Terjadi kesalahan pada server';
    throw new Error(errorMsg);
  }

  return data;
}

const api = {
  get: (endpoint) => fetchClient(endpoint, { method: 'GET' }),
  post: (endpoint, body) => fetchClient(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchClient(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchClient(endpoint, { method: 'DELETE' }),
};

export default api;
