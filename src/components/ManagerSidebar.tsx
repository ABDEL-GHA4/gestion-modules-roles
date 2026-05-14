import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCheck, Users, LayoutDashboard, Settings, ChevronLeft, ChevronRight, LogOut, Menu, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ManagerSidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(true);
  
  const menuItems = [
    
    {
      icon: UserCheck,
      name: "Gestion des Rôles",
      path: "/manager/roles",
    },
    {
      icon: BookOpen,
      name: "Consultation des Modules",
      path: "/manager/modules",
    },
    {
      icon: Users,
      name: "Liste des Agents",
      path: "/manager/agents",
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
            <span className="text-blue-600">Manager</span>Portal
          </h2>
        ) : (
          <h2 className="text-2xl font-bold text-blue-600">M</h2>
        )}
      </div>
      
      <nav className={cn("mt-8", isOpen ? "px-4" : "px-0")}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
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
                      <item.icon 
                        size={20} 
                        className={cn(
                          location.pathname === item.path ? "text-blue-100" : "text-blue-600"
                        )} 
                      />
                      {isOpen && (
                        <>
                          <span className="flex-1">{item.name}</span>
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="absolute bottom-16 w-full px-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-500 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Manager connecté</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSidebar;