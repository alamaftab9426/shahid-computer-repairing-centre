import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

const Cctv = () => {
  const [activeTab, setActiveTab] = useState("camera");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [products, setProducts] = useState({
    camera: [],
    harddisk: [],
    cable: [],
    service: [],
  });

  const [form, setForm] = useState({
    title: "",
    price: "",
    discount: "",
    description: "",
    image: null,
    preview: "",
  });

  const token = localStorage.getItem("adminToken"); // admin token

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/cctv`);
        const data = res.data.data;

        const grouped = { camera: [], harddisk: [], cable: [], service: [] };
        data.forEach((p) => {
          if (grouped[p.subcategory]) grouped[p.subcategory].push(p);
        });

        setProducts(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
        Swal.fire("Error", "Failed to fetch products", "error");
      }
    };

    fetchProducts();
  }, []);

  // Reset form
  const resetForm = () =>
    setForm({ title: "", price: "", discount: "", description: "", image: null, preview: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Please upload an image under 1 MB",
      });
      return;
    }

    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  // Submit (Add / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("price", form.price);
      data.append("discount", form.discount);
      data.append("description", form.description);
      data.append("subcategory", activeTab);
      if (form.image) data.append("image", form.image);

      let res;
      if (editIndex !== null) {
        const productId = products[activeTab][editIndex]._id;
        res = await axios.put(`${BASE_URL}/api/cctv/${productId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const updated = [...products[activeTab]];
        updated[editIndex] = res.data.data;
        setProducts({ ...products, [activeTab]: updated });

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Product updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        res = await axios.post(`${BASE_URL}/api/cctv`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts((prev) => ({
          ...prev,
          [activeTab]: [...prev[activeTab], res.data.data],
        }));

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Product added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      resetForm();
      setIsModalOpen(false);
      setEditIndex(null);
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      Swal.fire({ icon: "error", title: "Try Again", text: "Something went wrong!" });
    }
  };

  // Edit Product
  const handleEdit = (product, index) => {
    setForm({
      title: product.title,
      price: product.price,
      discount: product.discount,
      description: product.description,
      image: null,
      preview: `${BASE_URL}/uploads/cctv/${product.image}`,
    });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Delete Product
  const handleDelete = async (index) => {
    const productId = products[activeTab][index]._id;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${BASE_URL}/api/cctv/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const updated = [...products[activeTab]];
          updated.splice(index, 1);
          setProducts({ ...products, [activeTab]: updated });

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Product has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({ icon: "error", title: "Error", text: "Failed to delete product." });
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">CCTV Management</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {["camera", "harddisk", "cable", "service"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full text-lg font-medium transition-all shadow ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Products */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 capitalize">{activeTab} Products</h2>

        <button
          onClick={() => {
            resetForm();
            setEditIndex(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>

        <div className="mt-6">
          {products[activeTab].length === 0 ? (
            <p className="text-gray-500">No products added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {products[activeTab].map((p, index) => (
                <div
                  key={p._id}
                  className="bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden transform hover:scale-[1.02] hover:shadow-lg transition relative"
                >
                  <div className="relative overflow-hidden">
                    <img src={`${BASE_URL}/uploads/cctv/${p.image}`} alt={p.title} className="w-full h-56 object-cover" />
                    {p.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-md shadow">
                        {p.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold text-gray-800">{p.title}</h4>
                      <div className="space-x-2">
                        <button onClick={() => handleEdit(p, index)}>
                          <i className="ri-edit-box-line text-yellow-500 text-lg"></i>
                        </button>
                        <button onClick={() => handleDelete(index)}>
                          <i className="ri-delete-bin-6-line text-red-500 text-lg"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    <div className="mt-3">
                      <span className="font-bold text-indigo-600 text-lg">
                        ₹{p.discount ? p.price - (p.price * p.discount) / 100 : p.price}
                      </span>
                      {p.discount > 0 && <span className="ml-2 text-sm line-through text-gray-400">₹{p.price}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg"
            >
              <h3 className="text-xl font-bold mb-4">
                {editIndex !== null ? "Edit" : "Add New"} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded" required />
                <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount" className="w-full border p-2 rounded" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" required />
                <input type="file" onChange={handleImageUpload} className="w-full" />

                {form.preview && <img src={form.preview} alt="preview" className="w-24 h-24 object-cover rounded mt-2" />}

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditIndex(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editIndex !== null ? "Update" : "Save"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cctv;
