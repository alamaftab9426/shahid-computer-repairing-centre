import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main Pages
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import ForgotPassword from "./components/ForgotPassword";   
import ResetPassword from "./components/ResetPassword";
// User Pages
import UserLayout from "./components/User/UserLayout";
import UserHome from "./components/User/UserHome";
import UserProfile from "./components/User/UserProfile";
import PlaceOrder from "./components/User/PlaceOrder";
import UserCartItems from "./components/User/UserCartItems"
import MyOrders from"./components/User/Myorders"


// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard '
import Customers from './components/Admin/Customers';
import Address from './components/Admin/Address';
import Services from './components/Admin/Services';

import Cctv from './components/Admin/Cctv';
import OldLaptop from "./components/Admin/OldLaptop";
import Orders from './components/Admin/Order'


// Protects Routes
import PrivateRoute from "./components/Guard/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
       <Route path="/reset-password/:token" element={<ResetPassword />} />

        


        {/* User Panel with Layout */}
        <Route path="/user" element={
          <PrivateRoute allowedRoles={["user"]}>
            <UserLayout />
          </PrivateRoute>
        }>
          <Route index element={<UserHome />} />           
          <Route path="profile" element={<UserProfile />} /> 
          <Route path="cart" element={<UserCartItems />} /> 
          <Route path="placeorder" element={<PlaceOrder />} /> 
          <Route path="placeorder" element={<PlaceOrder />} /> 
          <Route path="myorders" element={<MyOrders />} /> 
        </Route>

        <Route path="/admin" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />           
          <Route path="dashboard" element={< Dashboard/>} /> 
          <Route path="customers" element={< Customers/>} /> 
          <Route path="address" element={< Address/>} /> 
          <Route path="services" element={< Services/>} /> 
          <Route path="oldLaptop" element={< OldLaptop/>} /> 
          <Route path="cctv" element={< Cctv/>} /> 
          <Route path="orders" element={< Orders/>} /> 
        
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
