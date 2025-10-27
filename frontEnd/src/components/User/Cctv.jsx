import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CartContext } from "../context/cartContext";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Cctv = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useContext(CartContext);

  const [selectedCategory, setSelectedCategory] = useState("camera");
  const [showAll, setShowAll] = useState(false);
  const [limit, setLimit] = useState(8);
  const [products, setProducts] = useState({ camera: [], harddisk: [], cable: [], service: [] });
  const [loading, setLoading] = useState(false);

  // Fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/cctv`);
        const data = res.data.data;
        const grouped = { camera: [], harddisk: [], cable: [], service: [] };
        data.forEach((p) => { if (grouped[p.subcategory]) grouped[p.subcategory].push(p); });
        setProducts(grouped);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  useEffect(() => { setLimit(window.innerWidth < 768 ? 6 : 8); }, []);
  useEffect(() => setShowAll(false), [selectedCategory]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, productType: "cctv" });
    toast.success("Product Added", {
      theme: "dark",
      transition: Bounce,
      position: "top-center",
    });
  };

  const handleBuyNow = (item) => {
    buyNow({ ...item, productType: "cctv" });
    navigate("/user/placeorder");
  };

  const getImageUrl = (item) => `${BASE_URL}/uploads/cctv/${item.image}`;

  const categories = { camera: "Camera", harddisk: "Hard Disk [HDD]", cable: "Cable", service: "Service" };
  const visibleCctv = showAll ? products[selectedCategory] : products[selectedCategory].slice(0, limit);

  return (
    <div className="w-full bg-zinc-950 min-h-screen -mt-5 md:pt-2 md:p-4 rounded-md shadow-lg">
      <h1 className="text-3xl font-bold text-white flex justify-center mb-8">ALL CCTV PRODUCTS</h1>

      <div className="flex justify-center gap-2 -mt-5 md:gap-4 mb-6 flex-wrap">
        {Object.keys(categories).map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-md font-semibold border transition ${selectedCategory===cat?"bg-white text-zinc-900":"bg-zinc-800 text-white hover:bg-zinc-700"}`}>{categories[cat]}</button>
        ))}
      </div>

      {loading ? <p className="text-white text-center text-xl">Loading...</p> :
      products[selectedCategory].length===0 ? <p className="text-white text-center text-xl">No products available.</p> :
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {visibleCctv.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="bg-zinc-900 border border-zinc-700 rounded-md md:rounded-xl overflow-hidden transform hover:scale-[1.02] transition relative flex flex-col">
            <div className="relative overflow-hidden group">
              <img src={getImageUrl(item)} alt={item.title} className="w-full h-64 object-cover"/>
              {item.discount>0 && <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-md shadow">{item.discount}% OFF</div>}
            </div>
            <div className="p-4 text-white flex flex-col flex-grow">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm mt-1 text-zinc-300 line-clamp-2">{item.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-green-400 text-lg">₹{item.discount?item.price-(item.price*item.discount)/100:item.price}</span>
                  {item.discount>0 && <span className="ml-2 text-sm line-through text-zinc-500">₹{item.price}</span>}
                </div>
                <span className="text-sm text-blue-400 font-medium">In Stock</span>
              </div>
              <div className="mt-auto flex gap-3 pt-4">
                <button onClick={()=>handleBuyNow(item)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition">Buy Now</button>
                <button onClick={()=>handleAddToCart(item)} className="flex-1 border border-zinc-500 hover:bg-zinc-700 py-2 rounded-md font-semibold text-white transition">Add to Cart</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>}

      {products[selectedCategory].length>limit && <div className="flex justify-center mt-6">
        <button onClick={()=>setShowAll(!showAll)} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full shadow-lg transition">{showAll?"Show Less":"Show More"}</button>
      </div>}
       <ToastContainer theme="dark" transition={Bounce} />
    </div>
  );
};

export default Cctv;
