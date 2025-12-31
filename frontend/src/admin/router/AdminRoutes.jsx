import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminBookings from "../pages/AdminBookings";
import AdminParking from "../pages/AdminParking";
import AdminProtectedRoute from "../components/AdminProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <AdminProtectedRoute>
            <AdminBookings />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/parking"
        element={
          <AdminProtectedRoute>
            <AdminParking />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}
