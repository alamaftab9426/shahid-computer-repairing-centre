import React, { useContext } from "react";
import { Trash2, Heart } from "lucide-react";
import { CartContext } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const UserCartItems = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  const { cart, removeFromCart, addToCart, decrementQuantity, placeOrder } = useContext(CartContext);
  const navigate = useNavigate();

  

  const handlePlaceOrder = () => {
    placeOrder();
    navigate("/user/placeOrder");
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + ((item.price * item.discount) / 100) * item.quantity, 0);
  const totalPayable = totalPrice - totalDiscount + 99;

  
  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white -mt-[9.5px]">
              <FiShoppingCart size={60} className="mb-4" />
              <h2 className="text-2xl mb-4">Your Cart is Empty</h2>
              <button
                onClick={() => navigate("/user")}
                className="bg-[#DC2626] px-6 py-2 rounded text-white"
              >
                Shop Now
              </button>
            </div>
    );

  // Correct folder and image logic
  const getImageUrl = (item) => {
    if (!item || !item.image) return "";
    if (item.image.startsWith("http")) return item.image;

    let folder = "products"; 
    const type = item.productType?.toLowerCase();

    if (type === "laptop") folder = "laptops";
    else if (type === "cctv") folder = "cctv";

    return `${BASE_URL}/uploads/${folder}/${item.image}`;
  };
  
  

  return (
    <div className="bg-zinc-950 min-h-screen py-8 px-4 md:px-10 text-white ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 uppercase">{cart.length} Items in your Cart</h2>
          <div className="bg-zinc-900 rounded-sm shadow divide-y divide-zinc-800">
            {cart.map((item) => (
              <div key={item._id} className="flex gap-4 p-4">
                <img
                  src={getImageUrl(item)}
                  alt={item.title || item.name}
                  className="w-28 h-28 object-cover rounded-lg border border-zinc-700"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-zinc-400">
                    {item.processor || item.description || ""}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xl font-bold text-white">
                      ₹{(item.price - (item.price * item.discount) / 100).toLocaleString()}
                    </span>
                    {item.discount > 0 && (
                      <>
                        <span className="line-through text-zinc-500 text-sm">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span className="text-green-400 text-sm">{item.discount}% OFF</span>
                      </>
                    )}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center border border-zinc-700 rounded-lg">
                      <button className="px-3 py-1 hover:bg-zinc-800" onClick={() => decrementQuantity(item._id)}>-</button>
                      <span className="px-4">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-zinc-800" onClick={() => addToCart(item)}>+</button>
                    </div>

                    <button className="flex items-center gap-1 text-zinc-400 hover:text-red-500" onClick={() => removeFromCart(item._id)}>
                      <Trash2 size={16} /> Remove
                    </button>

                    <button className="flex items-center gap-1 text-zinc-400 hover:text-pink-500">
                      <Heart size={16} /> Move to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 flex justify-end">
              <button className="bg-red-600 text-white px-4 py-2 rounded-sm font-medium shadow-md" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-zinc-900 rounded-sm shadow p-4 space-y-4 h-fit md:mt-11">
          <button className="w-full border border-dashed border-zinc-600 rounded-lg py-2 text-zinc-400 hover:bg-zinc-800">
            Apply Coupon
          </button>

          <h3 className="text-lg font-semibold border-b border-zinc-700 pb-2">Price Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Price ({cart.length} Items)</span><span>₹{totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{totalDiscount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Processing Fee</span><span>₹99</span></div>
            <div className="flex justify-between"><span>Delivery Charges</span><span className="text-green-400">Free</span></div>
            <div className="flex justify-between font-semibold border-t border-zinc-700 pt-2 mt-2"><span>Total Amount</span><span>₹{totalPayable.toLocaleString()}</span></div>
            <p className="text-green-400 text-xs">You've saved ₹{totalDiscount.toLocaleString()} on this order</p>
          </div>

          <button className="w-full bg-red-600 text-white py-2 rounded-SM font-medium">
            PLACE ORDER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCartItems;
