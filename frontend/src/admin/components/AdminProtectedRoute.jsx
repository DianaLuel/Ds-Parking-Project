import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin/login" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'ADMIN') return <Navigate to="/admin/login" />;
  } catch (e) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
