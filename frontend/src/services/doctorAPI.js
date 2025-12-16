// // frontend/src/services/doctorAPI.js
// import api from "./api";

// export const loginDoctor = (data) => api.post("/doctors/login", data);

// export const getAllCases = () => api.get("/cases");

// export const reviewCase = (caseId, data) =>
//   api.patch(`/cases/${caseId}/review`, data);

// export const getCaseByIdDoctor = (caseId) => api.get(`/cases/${caseId}`);


// frontend/src/services/doctorAPI.js
import api from "./api";

// Authentication
export const loginDoctor = (data) => api.post("/doctors/login", data);

// Case Management
export const getAllCases = () => api.get("/cases/all"); // Changed from "/cases" to "/cases/all"
export const getCaseByIdDoctor = (id) => api.get(`/cases/${id}`);
export const reviewCase = (id, data) => api.put(`/cases/${id}/review`, data);

// Doctor Dashboard Functions
export const getDoctorAppointments = () => api.get("/doctors/appointments");
export const getDoctorStats = () => api.get("/doctors/stats");

// Prescription & Follow-up
export const prescribeMedication = (caseId, data) => api.post(`/cases/${caseId}/prescribe`, data);
export const scheduleFollowup = (caseId, data) => api.post(`/cases/${caseId}/followup`, data);