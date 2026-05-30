import {
  LayoutDashboard,
  Package,
  Wallet,
  Users,
  Megaphone,
  Printer,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleLogout = () => {
    // 1. Hapus token dari localStorage
    localStorage.removeItem("token");

    // 2. Opsional: Hapus data sensitif lain jika ada
    localStorage.clear();

    // 3. Arahkan pengguna ke halaman login
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventaris", path: "/inventory", icon: Package },
    { name: "Kas", path: "/kas", icon: Wallet },
    { name: "Data Warga", path: "/warga", icon: Users },
    { name: "Papan Informasi", path: "/informasi", icon: Megaphone },
    { name: "Print Peminjaman", path: "/print-surat", icon: Printer },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col shadow-2xl">
      {/* Header Sidebar */}
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          NgN RT 25 Admin
        </h1>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
