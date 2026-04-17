const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = {
  getHeaders(token = null) {
    const headers = {};
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  },

  async get(endpoint, token = null) {
    const response = await fetch(`${API_URL}${endpoint}`, { 
      headers: this.getHeaders(token) 
    });
    return this.handleResponse(response);
  },

  async post(endpoint, body, token = null) {
    const headers = { ...this.getHeaders(token) };
    
    // Support FormData for file uploads
    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: body
    });
    return this.handleResponse(response);
  },

  async put(endpoint, body, token = null) {
    const headers = { 
        'Content-Type': 'application/json',
        ...this.getHeaders(token) 
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    return this.handleResponse(response);
  },

  async delete(endpoint, token = null) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(token)
    });
    return this.handleResponse(response);
  },

  async handleResponse(response) {
    let data;
    try {
        data = await response.json();
    } catch (e) {
        data = { message: 'Response was not JSON' };
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'API Request failed');
    }
    return data;
  }
};

export default api;
