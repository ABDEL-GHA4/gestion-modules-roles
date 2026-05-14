
import React from "react";
import { Outlet } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";
import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";

const ManagerLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const { modules } = useData();
  
  // Find the modules managed by this manager
  const managedModules = currentUser?.modules
    ? modules.filter((module) => currentUser.modules?.includes(module.id))
    : [];
  
  const modulesText = managedModules.length > 0
    ? managedModules.map((m) => m.name).join(", ")
    : "Aucun module";
  
  return (
    <Layout title={`Gestionnaire - ${modulesText}`}>
      <div className="flex">
        <ManagerSidebar />
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default ManagerLayout;
