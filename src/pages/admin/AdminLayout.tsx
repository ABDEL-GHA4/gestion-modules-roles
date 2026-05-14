
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import Layout from "../../components/Layout";

const AdminLayout: React.FC = () => {
  return (
    <Layout title="Système de Gestion des Modules et Rôles">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
