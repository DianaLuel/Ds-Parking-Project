import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { getAllBookings, getAllParkingLots } from "../api/adminApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalParkingLots: 0,
    totalSpots: 0,
    availableSpots: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, parkingRes] = await Promise.all([
          getAllBookings(),
          getAllParkingLots(),
        ]);

        const bookings = bookingsRes.data;
        const parkingLots = parkingRes.data;

        const totalBookings = bookings.length;
        const activeBookings = bookings.filter(b => b.status === 'ACTIVE').length;
        const totalParkingLots = parkingLots.length;
        const totalSpots = parkingLots.reduce((sum, lot) => sum + lot.total_spots, 0);
        const availableSpots = parkingLots.reduce((sum, lot) => sum + lot.available_spots, 0);

        setStats({
          totalBookings,
          activeBookings,
          totalParkingLots,
          totalSpots,
          availableSpots,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Active Bookings</h3>
            <p className="text-3xl font-bold text-green-600">{stats.activeBookings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Parking Lots</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalParkingLots}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Available Spots</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.availableSpots}/{stats.totalSpots}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/bookings"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              Manage Bookings
            </a>
            <a
              href="/admin/parking"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
            >
              Manage Parking
            </a>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
