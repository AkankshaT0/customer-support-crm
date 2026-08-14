import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'
});


/*
 * Attach JWT token to every protected request.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supportflow_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


/*
 * If token expires or becomes invalid,
 * remove it and redirect to login.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('supportflow_token');
      localStorage.removeItem('supportflow_admin');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export const login = (email, password) =>
  api.post('/auth/login', {
    email,
    password
  });


export const getTickets = (params = {}) =>
  api.get('/tickets', { params });

export const getTicket = (id) =>
  api.get(`/tickets/${id}`);

export const createTicket = (data) =>
  api.post('/tickets', data);

export const updateTicket = (id, data) =>
  api.put(`/tickets/${id}`, data);

export const getDashboard = () =>
  api.get('/tickets/dashboard');

export const triageTicket = (id) =>
  api.post('/ai/triage', {
    ticket_id: id
  });


export const exportTickets = () =>
  api.get('/tickets/export/csv', {
    responseType: 'blob'
  });


export default api;