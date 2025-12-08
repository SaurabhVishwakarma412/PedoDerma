// frontend/src/services/patientAPI.js
import api from "./api";

export const registerParent = (data) => api.post("/patients/register", data);

export const loginParent = (data) => api.post("/patients/login", data);

export const getMyCases = () => api.get("/cases/my");

export const submitCase = (payload) => {
  // payload should be FormData (because of file)
  return api.post("/cases", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getCaseById = (caseId) => api.get(`/cases/${caseId}`);
