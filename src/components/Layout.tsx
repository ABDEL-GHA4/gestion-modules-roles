import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, Menu, User, Home, Settings, Briefcase, FileText } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors md:hidden"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="hidden md:flex items-center space-x-2 bg-gray-100/80 hover:bg-gray-200/60 transition-colors rounded-full px-3 py-1 cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser.username}
                </span>
              </div>
            )}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50/50"
              size="sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden transition-opacity" 
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="bg-white h-full w-72 p-4 shadow-xl animate-in slide-in-from-left" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {currentUser && (
                <div className="flex items-center p-3 mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{currentUser.username}</p>
                    <p className="text-xs text-gray-500">{currentUser.role}</p>
                  </div>
                </div>
              )}
              
              <nav className="flex-1 space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => navigate("/dashboard")}
                >
                  <Home size={16} />
                  <span>Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => navigate("/projects")}
                >
                  <Briefcase size={16} />
                  <span>Projets</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => navigate("/reports")}
                >
                  <FileText size={16} />
                  <span>Rapports</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => navigate("/settings")}
                >
                  <Settings size={16} />
                  <span>Paramètres</span>
                </Button>
              </nav>
              
              <div className="mt-auto pt-4 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="pb-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-4 mt-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} <span className="font-medium text-blue-600">GestApp</span> - Tous droits réservés
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;