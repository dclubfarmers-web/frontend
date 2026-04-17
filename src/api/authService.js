import API from './axios';

export const login = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  if (data.session?.access_token) {
    localStorage.setItem('token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const register = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const { data } = await API.get('/auth/profile');
  return data;
};
