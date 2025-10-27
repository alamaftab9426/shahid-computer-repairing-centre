import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${BASE_URL}/api/admin/customers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        Swal.fire("Error", "Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle user active status
  const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.put(
      `${BASE_URL}/api/admin/customers/${userId}/status`,
      { isActive: !currentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Use response from backend instead of flipping manually
    const updatedUser = res.data.user;

    setCustomers(prev =>
      prev.map(user =>
        user._id === userId ? updatedUser : user
      )
    );

    Swal.fire(
      "Success",
      `User has been ${updatedUser.isActive ? "activated" : "deactivated"}`,
      "success"
    );
  } catch (err) {
    console.error("Failed to update status:", err);
    Swal.fire("Error", "Failed to update user status", "error");
  }
};

  if (loading) return <p className="p-5">Loading users...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-zinc-950 text-white">
              <th className="border border-gray-300 p-2">Customer Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Mobile</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">DOB</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((item, index) => (
              <tr
                key={item._id}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="px-4 py-3 capitalize">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/avt.avif"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3">{item.emailaddress}</td>
                <td className="py-3">{item.mobileno}</td>
                <td className="py-3">{item.gender}</td>
                <td className="py-3">{item.dob}</td>
                <td className="py-3">
                  {moment(item.createdAt).format("DD MMM YYYY, hh:mm:ss A")}
                </td>
                <td className="py-3">
                  {item.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="py-3">

                  {item.role !== "admin" && (
                    <button
                      onClick={() => toggleUserStatus(item._id, item.isActive)}
                      className={`px-3 py-1 rounded text-white ${item.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </div>
  );
};

export default Customers;
