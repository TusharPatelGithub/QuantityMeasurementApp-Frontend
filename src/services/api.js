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
  compare: async (fromValue, fromUnit, toValue, toUnit, type) => {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const response = await apiClient.post('/api/v1/quantities/compare', {
      first: {
        value: parseFloat(fromValue),
        unit: fromUnit.toUpperCase(),
        measurementType: formattedType,
      },
      second: {
        value: parseFloat(toValue),
        unit: toUnit.toUpperCase(),
        measurementType: formattedType,
      }
    });
    return response.data;
  },
  add: async (fromValue, fromUnit, toValue, toUnit, type) => {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const response = await apiClient.post('/api/v1/quantities/add', {
      first: {
        value: parseFloat(fromValue),
        unit: fromUnit.toUpperCase(),
        measurementType: formattedType,
      },
      second: {
        value: parseFloat(toValue),
        unit: toUnit.toUpperCase(),
        measurementType: formattedType,
      }
    });
    return response.data;
  },
  subtract: async (fromValue, fromUnit, toValue, toUnit, type) => {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const response = await apiClient.post('/api/v1/quantities/subtract', {
      first: {
        value: parseFloat(fromValue),
        unit: fromUnit.toUpperCase(),
        measurementType: formattedType,
      },
      second: {
        value: parseFloat(toValue),
        unit: toUnit.toUpperCase(),
        measurementType: formattedType,
      }
    });
    return response.data;
  },
  divide: async (fromValue, fromUnit, toValue, toUnit, type) => {
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    const response = await apiClient.post('/api/v1/quantities/divide', {
      first: {
        value: parseFloat(fromValue),
        unit: fromUnit.toUpperCase(),
        measurementType: formattedType,
      },
      second: {
        value: parseFloat(toValue),
        unit: toUnit.toUpperCase(),
        measurementType: formattedType,
      }
    });
    return response.data;
  },
  getHistory: async (operation) => {
    const response = await apiClient.get(`/api/v1/quantities/history/${operation}`);
    return response.data;
  }
};

export default apiClient;
