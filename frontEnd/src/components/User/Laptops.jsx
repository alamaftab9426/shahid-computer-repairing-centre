import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Laptops = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useContext(CartContext);

  const [selectedCategory, setSelectedCategory] = useState("dell");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(8);

  const categories = {
    dell: "Dell",
    hp: "HP",
    apple: "Apple",
    asus: "Asus",
    acer: "Acer",
    lenovo: "Lenovo",
    sumsung: "Sumsung",
  };

  const [laptops, setLaptops] = useState({
    dell: [],
    hp: [],
    apple: [],
    asus: [],
    acer: [],
    lenovo: [],
    sumsung: [],
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/laptop`);
        const data = res.data.data;

        const grouped = {
          dell: [],
          hp: [],
          apple: [],
          asus: [],
          acer: [],
          lenovo: [],
          sumsung: [],
        };

        data.forEach((p) => {
          if (grouped[p.subcategory]) grouped[p.subcategory].push(p);
        });

        setLaptops(grouped);
      } catch (err) {
        console.error("Error fetching laptops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Responsive limit
  useEffect(() => {
    const updateLimit = () => {
      setLimit(window.innerWidth < 768 ? 6 : 8);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => setShowAll(false), [selectedCategory]);

  const visibleLaptops = showAll
    ? laptops[selectedCategory]
    : laptops[selectedCategory].slice(0, limit);

  // Add to cart
  const handleAddToCart = (item) => {
    addToCart({ ...item, productType: "laptop" });
    toast.success("Product Added", {
      theme: "dark",
      transition: Bounce,
      position: "top-center",
    });
  };

  // Buy Now
const handleBuyNow = (item) => {
    buyNow({ ...item, productType: "laptop" });
    navigate("/user/placeorder");
  };

const getImageUrl = (item) => `${BASE_URL}/uploads/laptops/${item.image}`;


  return (
    <motion.div
      key="OLD LAPTOPS"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-zinc-950 -mt-5 md:p-4 rounded-md shadow-lg min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-3 md:mb-12 text-white text-center">
        ALL COMPANIES LAPTOP
      </h1>

      {/* Categories */}
      <div className="flex justify-center gap-2 md:-mt-9 md:gap-4 mb-6 flex-wrap">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-md font-semibold border transition ${
              selectedCategory === cat
                ? "bg-white text-zinc-900"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {categories[cat]}
          </button>
        ))}
      </div>

      {loading && <p className="text-white text-center">Loading laptops...</p>}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {visibleLaptops.map((item) => (
          <div
            key={item._id}
            className="bg-zinc-800 border border-zinc-700 rounded-md md:rounded-xl overflow-hidden transform hover:scale-[1.02] transition relative flex flex-col"
          >
            <div className="relative overflow-hidden group">
              <img
                src={`${BASE_URL}/${item.image}`}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-full left-0 group-hover:top-0 transition-all duration-500 w-full h-full bg-gradient-to-t from-black/80 to-transparent flex items-end rounded-t-xl">
                <div className="text-white p-4 space-y-1 text-sm font-medium">
                  <p>PROCESSOR: {item.processorType}</p>
                  <p>HARD DISK: {item.disk}</p>
                  <p>RAM: {item.ram}</p>
                  <p>GENERATION: {item.generation}</p>
                </div>
              </div>
              {item.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-md shadow">
                  {item.discount}% OFF
                </div>
              )}
            </div>

            <div className="p-4 text-white flex flex-col flex-grow">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm mt-1 text-zinc-300 line-clamp-2">
                {item.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-green-400 text-lg">
                    ₹
                    {item.discount
                      ? item.price - (item.price * item.discount) / 100
                      : item.price}
                  </span>
                  {item.discount > 0 && (
                    <span className="ml-2 text-sm line-through text-zinc-500">
                      ₹{item.price}
                    </span>
                  )}
                </div>
                <span className="text-sm text-blue-400 font-medium">
                  In Stock
                </span>
              </div>
              <div className="mt-auto flex gap-3 pt-4">
                <button
                  onClick={() => handleBuyNow(item)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 border border-zinc-500 hover:bg-zinc-700 py-2 rounded-md font-semibold text-white transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {laptops[selectedCategory].length > limit && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      <ToastContainer theme="dark" transition={Bounce} />
    </motion.div>
  );
};

export default Laptops;
