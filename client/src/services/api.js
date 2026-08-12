import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getTickets = (params = {}) => api.get("/tickets", { params });
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post("/tickets", data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const getDashboard = () => api.get("/tickets/dashboard");
export const triageTicket = (id) => api.post("/ai/triage", { ticket_id: id });
export const getExportUrl = () =>
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/tickets/export/csv`;

export default api;
