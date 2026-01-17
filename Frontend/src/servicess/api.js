import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // backend team will confirm later

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Admin APIs
export const fetchEmployeeStats = () => api.get("/employees/stats");
export const fetchUploads = () => api.get("/uploads");

// Employee APIs
export const fetchMyFitment = () => api.get("/employee/fitment");
export const fetchMyFatigue = () => api.get("/employee/fatigue");
export const fetchMyRecommendations = () => api.get("/employee/recommendations");
