import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link
            to="/admin/dashboard"
            className="hover:text-gray-300 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/bookings"
            className="hover:text-gray-300 transition-colors"
          >
            Bookings
          </Link>
          <Link
            to="/admin/parking"
            className="hover:text-gray-300 transition-colors"
          >
            Parking
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Admin Panel</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
