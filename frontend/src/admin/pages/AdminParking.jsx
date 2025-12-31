import { useEffect, useState } from "react";
import { getAllParkingLots, createParkingLot, addParkingSpot } from "../api/adminApi";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminParking() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateLotForm, setShowCreateLotForm] = useState(false);
  const [showAddSpotForm, setShowAddSpotForm] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState(null);
  const [newLot, setNewLot] = useState({ name: "", total_spots: "" });
  const [newSpot, setNewSpot] = useState({ spot_number: "", vehicle_type: "CAR" });

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      const res = await getAllParkingLots();
      setLots(res.data);
    } catch (error) {
      console.error("Error fetching parking lots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLot = async (e) => {
    e.preventDefault();
    try {
      await createParkingLot({
        name: newLot.name,
        total_spots: parseInt(newLot.total_spots)
      });
      setNewLot({ name: "", total_spots: "" });
      setShowCreateLotForm(false);
      fetchParkingLots();
      alert("Parking lot created successfully");
    } catch (error) {
      console.error("Error creating parking lot:", error);
      alert("Failed to create parking lot");
    }
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();
    try {
      await addParkingSpot(selectedLotId, newSpot);
      setNewSpot({ spot_number: "", vehicle_type: "CAR" });
      setShowAddSpotForm(false);
      setSelectedLotId(null);
      fetchParkingLots();
      alert("Parking spot added successfully");
    } catch (error) {
      console.error("Error adding parking spot:", error);
      alert("Failed to add parking spot");
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Parking Management</h1>
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Parking Lots Management</h1>
          <button
            onClick={() => setShowCreateLotForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Lot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lots.map((lot) => (
            <div key={lot.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{lot.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Total Spots: {lot.total_spots}</p>
                <p>Reserved Spots: {lot.reserved_spots}</p>
                <p>Available Spots: {lot.available_spots}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedLotId(lot.id);
                  setShowAddSpotForm(true);
                }}
                className="mt-4 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Add Spot
              </button>
            </div>
          ))}
        </div>

        {lots.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No parking lots found
          </div>
        )}

        {/* Create Lot Modal */}
        {showCreateLotForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Create New Parking Lot</h2>
              <form onSubmit={handleCreateLot}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Lot Name</label>
                  <input
                    type="text"
                    value={newLot.name}
                    onChange={(e) => setNewLot({...newLot, name: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Total Spots</label>
                  <input
                    type="number"
                    value={newLot.total_spots}
                    onChange={(e) => setNewLot({...newLot, total_spots: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateLotForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Spot Modal */}
        {showAddSpotForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add Parking Spot</h2>
              <form onSubmit={handleAddSpot}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Spot Number</label>
                  <input
                    type="text"
                    value={newSpot.spot_number}
                    onChange={(e) => setNewSpot({...newSpot, spot_number: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                  <select
                    value={newSpot.vehicle_type}
                    onChange={(e) => setNewSpot({...newSpot, vehicle_type: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="CAR">Car</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="TRUCK">Truck</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Spot
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSpotForm(false);
                      setSelectedLotId(null);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
