// frontend/src/services/DoctorApi.js
import api from "./api";

// Authentication
export const loginDoctor = (data) => api.post("/doctors/login", data);

// Case Management
export const getAllCases = () => api.get("/cases/all");
export const getCaseByIdDoctor = (id) => api.get(`/cases/${id}`);
export const reviewCase = (id, data) => api.patch(`/cases/${id}/review`, data);

// Doctor Dashboard Functions
export const getDoctorAppointments = () => api.get("/doctors/appointments");
export const getDoctorStats = () => api.get("/doctors/stats");

// Prescription & Follow-up
export const prescribeMedication = (caseId, data) => api.post(`/cases/${caseId}/prescribe`, data);
export const scheduleFollowup = (caseId, data) => api.post(`/cases/${caseId}/followup`, data);

// Slots Booking
export const getBookedSlots = (date) => api.get(`/doctors/booked-slots?date=${date}`);