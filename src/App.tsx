import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import ModulesPage from "./pages/admin/ModulesPage";
import RolesPage from "./pages/admin/RolesPage";
import AssignModulesPage from "./pages/admin/AssignModulesPage";
import ManagerLayout from "./pages/manager/ManagerLayout";
import RolesManagementPage from "./pages/manager/RolesManagementPage";
import ManagerConsultationModules from "./pages/manager/ManagerConsultationModules";
import AgentsListPage from "./pages/manager/AgentsListPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/admin/modules" replace />} />
              <Route path="modules" element={<ModulesPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="assign-modules" element={<AssignModulesPage />} />
            </Route>

            <Route
              path="/manager"
              element={
                <PrivateRoute allowedRoles={["manager"]}>
                  <ManagerLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/manager/roles" replace />} />
              <Route path="roles" element={<RolesManagementPage />} />
              <Route path="modules" element={<ManagerConsultationModules />} />
              <Route path="agents" element={<AgentsListPage />} />
            </Route>

            <Route
              path="/agent/dashboard"
              element={
                <PrivateRoute allowedRoles={["agent"]}>
                  <AgentDashboard />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
