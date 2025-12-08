// frontend/src/services/doctorAPI.js
import api from "./api";

export const loginDoctor = (data) => api.post("/doctors/login", data);

export const getAllCases = () => api.get("/cases");

export const reviewCase = (caseId, data) =>
  api.patch(`/cases/${caseId}/review`, data);

export const getCaseByIdDoctor = (caseId) => api.get(`/cases/${caseId}`);
