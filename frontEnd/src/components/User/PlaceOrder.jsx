import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";
import Swal from "sweetalert2";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const addressFormRef = useRef(null);

  const {
    cart,
    checkoutItems,
    setCheckoutItems,
    addToCart,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  // Scroll top
  useEffect(() => window.scrollTo(0, 0), []);

  // Set checkout items if empty
  useEffect(() => {
    if (checkoutItems.length === 0 && cart.length > 0) {
      setCheckoutItems(cart.map((item) => ({ ...item })));
    }
  }, [cart, checkoutItems, setCheckoutItems]);

  const items = checkoutItems.length ? checkoutItems : [];

  // Fetch addresses
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
  }, [BASE_URL, token]);

  // Set default selected address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Safe strings for validation
    const fullname = formValue.fullname ? formValue.fullname.toString().trim() : "";
    const mobile = formValue.mobile ? formValue.mobile.toString().trim() : "";
    const address = formValue.address ? formValue.address.toString().trim() : "";
    const city = formValue.city ? formValue.city.toString().trim() : "";
    const state = formValue.state ? formValue.state.toString().trim() : "";
    const country = formValue.country ? formValue.country.toString().trim() : "";
    const pincode = formValue.pincode ? formValue.pincode.toString().trim() : "";

    // Fullname
    if (!fullname) newErrors.fullname = "Fullname is required";
    else if (fullname.length < 5) newErrors.fullname = "Fullname must be at least 5 letters";

    // Mobile
    if (!mobile) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Enter a valid 10-digit mobile";

    // Address
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!country) newErrors.country = "Country is required";

    // Pincode
    if (!pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // Save / Edit address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        const res = await axios.put(
          `${BASE_URL}/api/user/placeorder/${editId}`,
          formValue,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses((prev) =>
          prev.map((a) => (a._id === editId ? res.data.address : a))
        );
        toast.success("Address Updated!", { theme: "dark", transition: Bounce, position: "top-center" });
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/user/placeorder`,
          formValue,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddresses((prev) => [res.data.address, ...prev]);
        toast.success("Address Saved!", { theme: "dark", transition: Bounce, position: "top-center" });
      }

      // Reset
      setFormValue({ fullname: "", mobile: "", address: "", city: "", state: "", country: "", pincode: "" });
      setShowNewAddressForm(false);
      setIsEditing(false);
      setEditId(null);
      setErrors({});
    } catch {
      toast.error("Save failed", { theme: "dark", transition: Bounce, position: "top-center" });
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/user/placeorder/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Deleted", { theme: "dark", transition: Bounce, position: "top-center" });
    } catch {
      toast.error("Delete failed", { theme: "dark", transition: Bounce, position: "top-center" });
    }
  };

  const handleEditAddress = (addr) => {
    const { fullname, mobile, address, city, state, country, pincode, _id } = addr;
    setFormValue({ fullname, mobile, address, city, state, country, pincode });
    setIsEditing(true);
    setEditId(_id);
    setShowNewAddressForm(true);
    setTimeout(() => addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  // Image URL
  const getImageUrl = (item) => {
    if (!item.image) return `${BASE_URL}/uploads/default.png`;
    if (item.image.startsWith("http")) return item.image;
    let folder = item.productType === "laptop" ? "laptops" : item.productType === "cctv" ? "cctv" : "products";
    return `${BASE_URL}/uploads/${folder}/${item.image}`;
  };

  // Prices
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalDiscount = items.reduce((acc, i) => acc + ((i.price * i.discount) / 100) * i.quantity, 0);
  const totalPayable = totalPrice - totalDiscount + 99;

  // Quantity handlers
  const handleIncrement = (item) => {
    setCheckoutItems((prev) =>
      prev.map((p) => (p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p))
    );
    if (cart.find((p) => p._id === item._id)) addToCart(item);
  };
  const handleDecrement = (item) => {
    setCheckoutItems((prev) =>
      prev.map((p) => (p._id === item._id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
    );
    if (cart.find((p) => p._id === item._id)) decrementQuantity(item._id);
  };
  const handleRemove = (item) => {
    setCheckoutItems((prev) => prev.filter((p) => p._id !== item._id));
    if (cart.find((p) => p._id === item._id)) removeFromCart(item._id);
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      toast.info("Please select delivery address first", { theme: "dark", position: "top-center" });
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!", { theme: "dark", position: "top-center" });
      return;
    }
    try {
      const laptops = items.filter((i) => i.productType === "laptop").map((i) => ({ productId: i._id, quantity: i.quantity }));
      const cctvs = items.filter((i) => i.productType === "cctv").map((i) => ({ productId: i._id, quantity: i.quantity }));
      const deliveryAddress = addresses.find((a) => a._id === selectedAddressId);

      await axios.post(`${BASE_URL}/api/order/placeorder`, { laptops, cctvs, paymentMethod, deliveryAddress }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: "success", title: "Order Placed Successfully!", showConfirmButton: false, timer: 1500 }).then(() => {
        setCheckoutItems([]);
        clearCart();
        navigate("/user/myorders");
      });
    } catch (err) {
      console.error(err);
      toast.error("Order failed: " + (err.response?.data?.message || err.message), { theme: "dark", position: "top-center" });
    }
  };

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[300px] md:h-[600px] bg-zinc-950 text-white">
        <FiShoppingCart size={60} className="mb-4" />
        <h2 className="text-2xl mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate("/user")} className="bg-[#DC2626] px-6 py-2 rounded text-white">Shop Now</button>
      </div>
    );

  return (
    <div className="bg-zinc-950 min-h-screen relative mt-6">
      <header className="bg-zinc-950 p-4 text-white font-bold text-lg uppercase text-center md:text-left">
        Shahid Computer Repairing Center
        <span className="text-sm font-normal ml-2 block md:inline">
          Explore Plus
        </span>
      </header>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          {/* Login */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <h2 className="font-semibold text-zinc-200 text-sm">
              <span className="text-blue-500 font-bold">1</span> LOGIN
            </h2>
            <p className="mt-2 text-zinc-300">aftab alam • +91 8853424605 ✓</p>
          </div>

          {/* Delivery Address */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <h2 className="font-semibold text-zinc-200 mb-3 text-sm">
              <span className="text-blue-500 font-bold">2</span> DELIVERY ADDRESS
            </h2>

            {!showAddressList && selectedAddressId ? (
              // Compact view
              addresses
                .filter((a) => a._id === selectedAddressId)
                .map((a) => (
                  <div
                    key={a._id}
                    className="border border-blue-500 bg-zinc-800 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-zinc-200">
                        {a.fullname} • {a.mobile} ✓
                      </p>
                      <p className="text-zinc-400">
                        {a.address}, {a.city}, {a.state} - {a.pincode}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddressList(true)}
                      className="text-blue-400"
                    >
                      CHANGE
                    </button>
                  </div>
                ))
            ) : (
              // Full list
              <>
                {addresses.map((a) => (
                  <div
                    key={a._id}
                    className={`border rounded-lg p-4 mb-3 ${selectedAddressId === a._id
                      ? "border-blue-500 bg-zinc-800"
                      : "border-zinc-700"
                      }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={selectedAddressId === a._id}
                        onChange={() => setSelectedAddressId(a._id)}
                      />
                      <div>
                        <p className="font-semibold text-zinc-200">
                          {a.fullname} • {a.mobile}
                        </p>
                        <p className="text-zinc-400">
                          {a.address}, {a.city}, {a.state} - {a.pincode}
                        </p>
                      </div>
                    </label>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleEditAddress(a)}
                        className="text-blue-400 relative font-semibold after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(a._id)}
                        className="text-red-400"
                      >
                        Delete
                      </button>
                    </div>


                    {selectedAddressId === a._id && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowAddressList(false)}
                          className="bg-[#DC2626] text-white py-2 px-6 rounded"
                        >
                          Deliver Here
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add new */}
                <div className="mt-5 border-t border-zinc-700 pt-4">
                  <p
                    onClick={() => {
                      setShowNewAddressForm(!showNewAddressForm);
                      setIsEditing(false);
                      setFormValue({
                        fullname: "",
                        mobile: "",
                        address: "",
                        city: "",
                        state: "",
                        country: "",
                        pincode: "",
                      });
                    }}
                    className="font-semibold text-blue-400 cursor-pointer"
                  >
                    + {showNewAddressForm ? "Cancel" : "ADD A NEW ADDRESS"}
                  </p>

                  {showNewAddressForm && (
                    <form
                      onSubmit={handleSaveAddress}
                      ref={addressFormRef}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                    >
                      {[
                        "fullname",
                        "mobile",
                        "address",
                        "city",
                        "state",
                        "country",
                        "pincode",
                      ].map((f) => (
                        <div key={f} className="flex flex-col">
                          <input
                            name={f}
                            value={formValue[f]}
                            onChange={handleChange}
                            placeholder={f}
                            className="p-2 rounded border bg-zinc-800 text-zinc-200 uppercase"
                          />
                          {errors[f] && (
                            <span className="text-red-500 text-xs mt-1">{errors[f]}</span>
                          )}
                        </div>
                      ))}

                      <div className="col-span-2 flex gap-4 mt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-[#DC2626] text-white py-2 rounded"
                        >
                          {isEditing ? "UPDATE" : "SAVE AND DELIVER HERE"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="flex-1 bg-zinc-700 text-white py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>


                  )}
                </div>

              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <h2 className="font-semibold text-zinc-200 mb-3 border-b pb-2">
              <span className="text-blue-500 font-bold">3</span> ORDER SUMMARY
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 items-start border-b border-zinc-800 pb-4"
                >
                  <div className="w-28 flex flex-col items-center">
                    <div className="w-24 h-24 bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={getImageUrl(item)}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="px-3 py-1 rounded bg-zinc-700 text-white"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-zinc-800 rounded text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="px-3 py-1 rounded bg-zinc-700 text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-zinc-100 font-medium">{item.name}</p>
                    <p className="text-zinc-400 text-sm">
                      Seller: Flashtech Retail
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="line-through text-zinc-500 text-sm">
                        ₹
                        {Math.round(
                          item.price + (item.price * item.discount) / 100
                        ).toLocaleString()}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        ₹{item.price.toLocaleString()}
                      </p>
                      <p className="text-green-400 text-sm">
                        {item.discount}% OFF
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-400 text-sm font-semibold mt-2"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleContinueToPayment}
                className="bg-[#DC2626] text-white px-6 py-2 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PRICE DETAILS */}
        <div className="w-full lg:w-80">
          <div className="bg-zinc-900 rounded-lg p-4 border">
            <h3 className="font-semibold text-zinc-200 mb-3">PRICE DETAILS</h3>
            <div className="space-y-2 text-zinc-300 text-sm">
              <div className="flex justify-between">
                <span>Price ({items.length} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-400">
                  -₹{totalDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>₹99</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total Payable</span>
                <span>₹{totalPayable.toLocaleString()}</span>
              </div>
              <p className="text-green-400 mt-2">
                You saved ₹{totalDiscount.toLocaleString()} on this order
              </p>
            </div>
            <button
              onClick={handleContinueToPayment}
              className="w-full bg-[#DC2626] text-white py-2 rounded mt-4"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Model */}
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="bg-white w-[400px] rounded-md shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Select Payment Method
                </h2>

                <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:border-red-500 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <FaMoneyBillWave className="text-green-600 text-xl" />
                  <span className="text-gray-700 font-medium">
                    Cash on Delivery (COD)
                  </span>
                </label>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleConfirmOrder}
                    className="flex-1 bg-[#DC2626] text-white py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      <ToastContainer theme="dark" transition={Bounce} />



    </div>


  );
};

export default PlaceOrder;
