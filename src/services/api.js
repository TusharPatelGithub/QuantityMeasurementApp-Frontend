import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/Auth/login', { email, password });
    return response.data;
  },
  register: async (fullName, email, password, mobileNumber) => {
    const response = await apiClient.post('/api/Auth/register', {
      fullName,
      email,
      password,
      mobileNumber,
    });
    return response.data;
  },
};

export const measurementService = {
  convert: async (value, unit, type, targetUnit) => {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const response = await apiClient.post('/api/v1/quantities/convert', {
      first: {
        value: parseFloat(value),
        unit: unit.toUpperCase(),
        measurementType: formattedType,
      },
      targetUnit: targetUnit.toUpperCase(),
    });
    return response.data;
  },
};

export default apiClient;
