import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const featureApiClient = axios.create({
  baseURL: API_BASE,
});

featureApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const featureApi = {
  // =========================
  // Carbon Targets
  // =========================

  getTargets: async (mineId) => {
    const response = await featureApiClient.get(
      `/targets${mineId ? `?mine=${mineId}` : ""}`
    );

    return response.data;
  },

  createTarget: async (data) => {
    const response = await featureApiClient.post(
      "/targets",
      data
    );

    return response.data;
  },

  getTargetProgress: async (targetId) => {
    const response = await featureApiClient.get(
      `/targets/${targetId}/progress`
    );

    return response.data;
  },

  // =========================
  // Carbon Score
  // =========================

  getCarbonScore: async (mineId) => {
    const response = await featureApiClient.get(
      `/carbon-score/${mineId}`
    );

    return response.data;
  },

  // =========================
  // Alerts
  // =========================

  getAlerts: async (params = "") => {
    const response = await featureApiClient.get(
      `/alerts${params ? `?${params}` : ""}`
    );

    return response.data;
  },

  generateAlerts: async (mineId) => {
    const response = await featureApiClient.post(
      `/alerts/generate/${mineId}`
    );

    return response.data;
  },

  acknowledgeAlert: async (alertId) => {
    const response = await featureApiClient.put(
      `/alerts/${alertId}/acknowledge`
    );

    return response.data;
  },

  // =========================
  // Forecast
  // =========================

  getForecast: async (
    mineId,
    history = 12,
    periods = 6
  ) => {
    const response = await featureApiClient.get(
      `/forecast/${mineId}?history=${history}&periods=${periods}`
    );

    return response.data;
  },

  // =========================
  // Carbon Advisor
  // =========================

  getRecommendations: async (mineId) => {
    const response = await featureApiClient.get(
      `/recommendations/${mineId}`
    );

    return response.data;
  },

  // =========================
  // Carbon Projects
  // =========================

  getProjects: async (mineId) => {
    const response = await featureApiClient.get(
      `/projects${mineId ? `?mine=${mineId}` : ""}`
    );

    return response.data;
  },

  createProject: async (data) => {
    const response = await featureApiClient.post(
      "/projects",
      data
    );

    return response.data;
  },

  updateProject: async (projectId, data) => {
    const response = await featureApiClient.put(
      `/projects/${projectId}`,
      data
    );

    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await featureApiClient.delete(
      `/projects/${projectId}`
    );

    return response.data;
  },

  // =========================
  // Reports
  // =========================

  getReports: async (mineId) => {
    const response = await featureApiClient.get(
      `/reports${mineId ? `?mine=${mineId}` : ""}`
    );

    return response.data;
  },

  generateReport: async (data) => {
    const response = await featureApiClient.post(
      "/reports/generate",
      data
    );

    return response.data;
  },

  getReport: async (reportId) => {
    const response = await featureApiClient.get(
      `/reports/${reportId}`
    );

    return response.data;
  },

  // =========================
  // Audit Logs
  // =========================

  getAuditLogs: async (params = "") => {
    const response = await featureApiClient.get(
      `/audit${params ? `?${params}` : ""}`
    );

    return response.data;
  },
};

export default featureApiClient;