//patientAPI.js

import api from "./api";

/* ================= AUTH ================= */

// Register parent
export const registerParent = (data) => {
  return api.post("/patients/register", data);
};

// Login parent
export const loginParent = (data) => {
  return api.post("/patients/login", data);
};

/* ================= CASE MANAGEMENT ================= */

// Get logged-in parent's cases
export const getMyCases = () => {
  return api.get("/cases/my");
};

// Submit new case (with image)
export const submitCase = (formData) => {
  return api.post("/cases", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get single case by ID
export const getCaseById = (caseId) => {
  return api.get(`/cases/${caseId}`);
};

/* ================= APPOINTMENTS ================= */
/*
⚠️ Backend routes not implemented yet.
Functions kept to avoid frontend crashes.
*/

export const bookAppointment = (data) => {
  return api.post("/appointments", data);
};

export const getAppointments = () => {
  return api.get("/appointments");
};

export const getUpcomingAppointments = () => {
  return api.get("/appointments/upcoming");
};

/* ================= MEDICAL RECORDS ================= */
/*
⚠️ Backend route not implemented yet.
*/

export const getMedicalRecords = () => {
  return api.get("/medical-records");
};

/* ================= DOCTORS ================= */

export const getDoctors = () => {
  return api.get("/doctors");
};

/* ================= PRESCRIPTIONS ================= */
/*
⚠️ Backend route not implemented yet.
*/

export const getPrescriptions = () => {
  return api.get("/prescriptions");
};

/* ================= PROFILE ================= */

// Get parent profile
export const getParentProfile = () => {
  return api.get("/patients/profile");
};

// Update parent profile
export const updateParentProfile = (data) => {
  return api.put("/patients/profile", data);
};

/* ================= DASHBOARD ================= */
/*
⚠️ Backend route not implemented yet.
*/

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};
