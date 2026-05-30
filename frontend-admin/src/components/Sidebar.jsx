import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wallet,
  Users,
  Megaphone,
  Printer,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const LOGO_URL =
    "https://ik.imagekit.io/bonekie/image%20asset/rt-25-logo.png"; // Ganti dengan URL ImageKit Anda

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventaris", path: "/inventory", icon: Package },
    { name: "Kas", path: "/kas", icon: Wallet },
    { name: "Data Warga", path: "/warga", icon: Users },
    { name: "Informasi", path: "/informasi", icon: Megaphone },
    { name: "Cetak", path: "/print-surat", icon: Printer },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Keluar?",
      text: "Anda akan diarahkan ke halaman login.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e4a6e",
      confirmButtonText: "Ya, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  return (
    <div className="w-64 h-screen bg-[#1e4a6e] text-slate-100 flex flex-col shadow-xl">
      {/* Logo Header */}
      <div className="p-6 flex flex-col items-center border-b border-[#163853]">
        <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg mb-3">
          <img
            src={LOGO_URL}
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <h1 className="font-bold text-lg tracking-wide text-white">
          RT 25 Ngunan Unan
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            className={(
              { isActive }, // <--- isActive di sini baru valid
            ) =>
              `flex items-center ... ${isActive ? "bg-[#7ba85a]" : "hover:bg-[#163853]"}`
            }
          >
            {/* Di dalam sini, untuk ikon, Anda bisa akses isActive juga dengan cara yang sama */}
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <ChevronRight
                  size={16}
                  className={`transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#163853]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-orange-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
