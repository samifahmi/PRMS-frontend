import axios from 'axios';

// const API_URL = 'https://prms-backend-rrdo.onrender.com';
const API_URL = 'http://localhost:5000';


// Set up axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API calls
export const login = async (credentials) => {
  const response = await apiClient.post('api/auth/signin', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post('api/auth/signup', userData);
  return response.data;
};

// Patient management API calls
export const getPatients = async () => {
  const response = await apiClient.get('api/patients');
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await apiClient.get(`api/patients/${id}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await apiClient.post('api/patients', patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await apiClient.put(`api/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await apiClient.delete(`api/patients/${id}`);
  return response.data;
};

// User management API calls
export const getUsers = async () => {
  const res = await axios.get('/api/users');
  return res.data;
};

// Appointment management API calls
export const getPatientAppointments = async (patientId) => {
  const res = await axios.get(`/api/appointments?patient=${patientId}`);
  return res.data;
};