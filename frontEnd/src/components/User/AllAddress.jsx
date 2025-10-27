import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import axios from "axios";

const AllAddress = () => {
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_URL || "";

  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/placeorder`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };
    fetchAddresses();
  }, []);

  // Edit handler
  const handleEdit = (addr) => {
    setFormValue({ ...addr });
    setEditId(addr._id);
    setShowModal(true);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/user/placeorder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter((addr) => addr._id !== id));
      Swal.fire("Deleted!", "Address has been deleted.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to delete address.", "error");
    }
  };

  // Save/Update handler
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(
          `${BASE_URL}/api/user/placeorder/${editId}`,
          formValue,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses((prev) =>
          prev.map((a) => (a._id === editId ? res.data.address : a))
        );
        Swal.fire("Updated!", "Address updated successfully.", "success");
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/user/placeorder`,
          formValue,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses([res.data.address, ...addresses]);
        Swal.fire("Saved!", "Address saved successfully.", "success");
      }
      setShowModal(false);
      setEditId(null);
      setFormValue({
        fullname: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to save address.", "error");
    }
  };

  const handleChange = (e) =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  return (
    <div className="py-5 px-3 bg-zinc-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Your All Address
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-zinc-900/90 border rounded-md p-4 shadow-md flex flex-col justify-between gap-2 py-10"
          >
            <div>
              <h2 className="text-white font-semibold">{addr.fullname}</h2>
              <p className="text-zinc-300">{addr.mobile}</p>
              <p className="text-zinc-300">
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3">
              <button
                onClick={() => handleEdit(addr)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 rounded-sm text-white text-sm hover:bg-blue-700 transition"
              >
                <FiEdit className="text-sm" /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-red-600 rounded-sm text-white text-sm hover:bg-red-700 transition"
              >
                <FiTrash2 className="text-sm" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="bg-zinc-900 rounded-md shadow-lg p-6 w-full max-w-md text-white">
                <h2 className="text-xl font-bold mb-4">
                  {editId ? "Edit Address" : "Add Address"}
                </h2>
                <form className="grid grid-cols-1 gap-3" onSubmit={handleSave}>
                  {[
                    "fullname",
                    "mobile",
                    "address",
                    "city",
                    "state",
                    "country",
                    "pincode",
                  ].map((f) => (
                    <input
                      key={f}
                      name={f}
                      value={formValue[f]}
                      onChange={handleChange}
                      placeholder={f.toUpperCase()}
                      className="p-2 rounded border border-zinc-700 bg-zinc-800 text-white"
                      required
                    />
                  ))}
                  <div className="flex gap-3 mt-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
                    >
                      {editId ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-zinc-700 py-2 rounded hover:bg-zinc-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllAddress;
