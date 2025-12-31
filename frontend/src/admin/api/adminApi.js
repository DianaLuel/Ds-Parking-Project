import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT automatically
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =======================
   AUTH
======================= */
export const adminLogin = (credentials) =>
  adminApi.post("/auth/login", credentials);

/* =======================
   BOOKINGS
======================= */
export const getAllBookings = () =>
  adminApi.get("/admin/bookings");

export const cancelBookingByAdmin = (bookingId) =>
  adminApi.delete(`/admin/bookings/${bookingId}`);

/* =======================
   PARKING
======================= */
export const getAllParkingLots = () =>
  adminApi.get("/admin/lots");

export const createParkingLot = (data) =>
  adminApi.post("/admin/lots", data);

export const addParkingSpot = (lotId, data) =>
  adminApi.post(`/admin/lots/${lotId}/spots`, data);
