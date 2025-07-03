import axios from 'axios';

// const API_BASE_URL = 'https://prms-backend-rrdo.onrender.com';
const API_BASE_URL = 'http://localhost:5000';

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for request and response handling
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        // Unauthorized
        console.error('Unauthorized access - redirecting to login');
      } else if (response.status === 403) {
        // Forbidden
        console.error('Forbidden - insufficient permissions');
      } else if (response.status === 429) {
        // Rate limit
        const event = new CustomEvent('rateLimit', { detail: response.data?.message || 'Too many requests. Please try again later.' });
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(response?.data || error);
  }
);

// API functions
export const login = async ({ email, password }) => {
  const res = await apiClient.post('/api/auth/signin', { email, password });
  return res;
};

export const register = async ({ name, email, password }) => {
  return await apiClient.post('/api/auth/signup', { fullName: name, email, password });
};

export const forgotPassword = async (email) => {
  return await apiClient.post('/api/auth/forgot-password', { email });
};

export const resetPassword = async (token, password) => {
  return await apiClient.patch(`/api/auth/reset-password/${token}`, { password });
};

export const getProfile = async () => {
  return await apiClient.get('/api/profile/me');
};

export const fetchPatients = async () => {
  return await apiClient.get('/api/patients/');
};

// Admin/Staff User Management
export const getUsers = async () => {
  return await apiClient.get('/api/users/');
};

export const updateUserRole = async (userId, newRole) => {
  return await apiClient.patch(`/api/users/${userId}/role`, { role: newRole });
};

export const updateUserStatus = async (userId, active) => {
  return await apiClient.patch(`/api/users/${userId}/status`, { active });
};

export const deleteUser = async (userId) => {
  return await apiClient.delete(`/api/users/${userId}`);
};

// Patient Management (CRUD)
export const createPatient = async (patientData) => {
  return await apiClient.post('/api/patients/', patientData);
};

export const getPatientById = async (patientId) => {
  return await apiClient.get(`/api/patients/${patientId}`);
};

export const updatePatient = async (patientId, patientData) => {
  return await apiClient.patch(`/api/patients/${patientId}`, patientData);
};

export const deletePatient = async (patientId) => {
  return await apiClient.delete(`/api/patients/${patientId}`);
};

export const searchPatients = async (query) => {
  return await apiClient.get(`/api/patients/patients/search?q=${encodeURIComponent(query)}`);
};

// Appointment Management (CRUD)
export const createAppointment = async (appointmentData) => {
  return await apiClient.post('/api/appointments/', appointmentData);
};

export const fetchAppointments = async () => {
  return await apiClient.get('/api/appointments/');
};

export const getAppointmentById = async (appointmentId) => {
  return await apiClient.get(`/api/appointments/${appointmentId}`);
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  return await apiClient.patch(`/api/appointments/${appointmentId}`, appointmentData);
};

export const deleteAppointment = async (appointmentId) => {
  return await apiClient.delete(`/api/appointments/${appointmentId}`);
};

export const getAppointmentsToday = async () => {
  return await apiClient.get('/api/appointments/today');
};

export const getAppointmentsByDate = async (date) => {
  return await apiClient.get(`/api/appointments/by-date?date=${date}`);
};

export const getMyAppointments = async () => {
  return await apiClient.get('/api/appointments/my-appointments');
};

export const getMyAppointmentsToday = async () => {
  return await apiClient.get('/api/appointments/today/my');
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  return await apiClient.patch(`/api/appointments/${appointmentId}/status`, { status });
};

export const getAppointmentsForPatient = async (patientId) => {
  return await apiClient.get(`/api/appointments/patient/${patientId}`);
};

// Medical History
export const getMedicalHistory = async (patientId) => {
  return await apiClient.get(`/api/history/patients/${patientId}/history`);
};

export const addMedicalHistory = async (patientId, historyData) => {
  return await apiClient.post(`/api/history/patients/${patientId}/history`, historyData);
};

export const updateMedicalHistory = async (historyId, historyData) => {
  return await apiClient.patch(`/api/history/history/${historyId}`, historyData);
};

export const deleteMedicalHistory = async (historyId) => {
  return await apiClient.delete(`/api/history/history/${historyId}`);
};

// Reports
export const fetchSummaryReport = async () => {
  return await apiClient.get('/api/reports/summary');
};

export const fetchAppointmentsByDateRange = async (from, to) => {
  return await apiClient.get(`/api/reports/appointments-by-date?from=${from}&to=${to}`);
};

export const getFrequentDiagnoses = async () => {
  return await apiClient.get('/api/reports/frequent-diagnoses');
};

// Audit Logs
export const fetchAuditLogs = async () => {
  return await apiClient.get('/api/audit/');
};

export const updateProfile = async (profileData) => {
  return await apiClient.patch('/api/profile/me', profileData);
};

// Project Management
export const createProject = async (projectData) => {
  return await apiClient.post('/api/users/me/projects/', projectData);
};

export const startAnalysis = async (projectId, url) => {
  return await apiClient.post(`/api/users/me/projects/${projectId}/analysis/`, { url });
};

export const getAnalysisResult = async (projectId, resultId) => {
  return await apiClient.get(`/api/users/me/projects/${projectId}/analysis/${resultId}`);
};

export default apiClient;