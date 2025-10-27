import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { Outlet } from "react-router-dom";






const AdminLayout = () => {
    const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();
  

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };
  
  

  const menus = [
    { label: "Dashboard", icon: "ri-dashboard-3-line", link: "/admin/dashboard" },
    { label: "Customers", icon: "ri-user-3-line", link: "/admin/customers" },
    { label: "Address", icon: "ri-user-3-line", link: "/admin/address" },
    { label: "Services", icon: "ri-user-3-line", link: "/admin/services" },
    { label: "OldLaptop", icon: "ri-shopping-cart-line", link: "/admin/OldLaptop" },
    { label: "Cctv Camera", icon: "ri-shopping-cart-line", link: "/admin/Cctv" },
    { label: "Orders", icon: "ri-shape-line", link: "/admin/orders" },
    { label: "Payments", icon: "ri-money-dollar-circle-line", link: "/admin/payments" },
    { label: "Settings", icon: "ri-settings-3-line", link: "/admin/settings" },
  ];

  const Sidebar = ({ isMobile }) => (
    <aside
      className={`fixed top-0 left-0 h-full bg-zinc-900 z-50 transition-all duration-300 overflow-hidden ${
        isMobile ? (mobileSidebar ? "w-64" : "w-0") : sidebarOpen ? "w-64" : "w-0"
      }`}
    >
      <div className="p-4 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">
            Admin<span className="text-blue-500">Home</span>
          </h2>
          {isMobile && (
            <button onClick={() => setMobileSidebar(false)} className="text-white text-2xl">
              <i className="ri-close-line" />
            </button>
          )}
        </div>
        <nav className="flex flex-col gap-2">
          {menus.map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className={`flex items-center gap-3 px-4 py-2 rounded-sm text-[16px] transition-all duration-200 ${
                location.pathname === item.link
                  ? "bg-rose-600 text-white"
                  : "text-gray-300 hover:bg-rose-500 hover:text-white"
              }`}
              onClick={() => isMobile && setMobileSidebar(false)}
            >
              <i className={item.icon}></i>
              {item.label}
            </Link>
          ))}
          <button
            className="flex items-center gap-3 px-4 py-2 text-left rounded-md text-gray-300 hover:bg-rose-500 hover:text-white"
            onClick={handleLogout}
          >
            <i className="ri-logout-circle-r-line" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar isMobile={false} />
      </div>
      <div className="md:hidden block">
        <Sidebar isMobile={true} />
      </div>

      {/* Main content */}
      <div
        className={`min-h-screen bg-gray-100 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* Top Navbar */}
        <nav className="bg-white px-6 py-3 shadow flex items-center mt-[-80px] justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-xl"
              onClick={() => setMobileSidebar(true)}
            >
              <i className="ri-menu-2-line" />
            </button>
            <button
              className="hidden md:block text-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <i className={sidebarOpen ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"} />
            </button>
            <h1 className="text-lg font-bold">
              Admin<span className="text-blue-600 ml-1">Home</span>
            </h1>
          </div>
          <div className="relative">
            <img
              src="/images/avt.avif"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              alt="avatar"
            />
            {accountMenuOpen && (
              <div className="absolute right-0 top-12 bg-white shadow-md rounded-md w-44 p-3 z-50">
                <p className="text-sm mb-2">Admin</p>
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-sm hover:underline w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Page content */}
       <main className="p-6"><Outlet /></main>
      </div>
      
    </>
  );
};

export default AdminLayout;
