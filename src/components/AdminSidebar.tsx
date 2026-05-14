import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layers, Users, UserCheck, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Use a try-catch to gracefully handle any routing context issues
  let location = { pathname: "" };
  try {
    location = useLocation();
  } catch (error) {
    console.error("Router context not available:", error);
  }
  
  const menuItems = [
    {
      icon: Layers,
      name: "Gestion des Modules",
      path: "/admin/modules"
    },
    {
      icon: Users,
      name: "Gestion des Rôles",
      path: "/admin/roles"
    },
    {
      icon: UserCheck,
      name: "Attribution des Modules",
      path: "/admin/assign-modules"
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn(
      "bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen shadow-lg border-r border-slate-200 transition-all duration-300 relative",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Toggle button for mobile */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden absolute -right-3 top-4 bg-blue-600 text-white p-1 rounded-full shadow-md z-50"
      >
        <Menu size={16} />
      </button>
      
      {/* Toggle button for desktop */}
      <button 
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full shadow-md z-50"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      
      <div className={cn(
        "p-6 border-b border-slate-200 flex items-center",
        isOpen ? "justify-start" : "justify-center"
      )}>
        {isOpen ? (
          <h2 className="text-2xl font-bold text-slate-800">
            <span className="text-blue-600">Admin</span>Portal
          </h2>
        ) : (
          <h2 className="text-2xl font-bold text-blue-600">A</h2>
        )}
      </div>
      
      <nav className={cn("mt-8", isOpen ? "px-4" : "px-0")}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path} className={cn(!isOpen && "flex justify-center")}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 py-3 rounded-lg transition-all duration-200 font-medium",
                  location.pathname === item.path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-200 hover:text-blue-600",
                  isOpen ? "px-4" : "px-0 justify-center w-12 mx-auto"
                )}
                title={!isOpen ? item.name : ""}
              >
                <item.icon size={20} className={cn(
                  location.pathname === item.path ? "text-blue-100" : "text-blue-600"
                )} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Administrateur connecté</span>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;