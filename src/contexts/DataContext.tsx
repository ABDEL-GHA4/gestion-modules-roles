import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import type { AgentModule, AppData, DataContextType, Module, Role, User } from "../types/dataTypes";

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agentModules, setAgentModules] = useState<AgentModule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiRequest<AppData>("/data");
      setModules(data.modules);
      setRoles(data.roles);
      setUsers(data.users);
      setAgentModules(data.agentModules);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors du chargement des données";
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const addModule = async (module: Omit<Module, "id">) => {
    try {
      const createdModule = await apiRequest<Module>("/modules", {
        method: "POST",
        body: module
      });

      setModules((previous) => [...previous, createdModule]);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de l'ajout du module";
      setError(message);
      console.error(message);
    }
  };

  const updateModule = async (id: number, updatedModule: Partial<Module>) => {
    try {
      const savedModule = await apiRequest<Module>(`/modules/${id}`, {
        method: "PUT",
        body: updatedModule
      });

      setModules((previous) => previous.map((module) => (module.id === id ? savedModule : module)));
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de la modification du module";
      setError(message);
      console.error(message);
    }
  };

  const deleteModule = async (id: number) => {
    try {
      await apiRequest<{ message: string }>(`/modules/${id}`, { method: "DELETE" });

      const moduleRoleIds = roles.filter((role) => role.moduleId === id).map((role) => role.id);

      setModules((previous) => previous.filter((module) => module.id !== id));
      setRoles((previous) => previous.filter((role) => role.moduleId !== id));
      setAgentModules((previous) => previous.filter((am) => am.moduleId !== id));
      setUsers((previous) =>
        previous.map((user) => ({
          ...user,
          modules: user.modules?.filter((moduleId) => moduleId !== id),
          assignedRoles: user.assignedRoles?.filter((roleId) => !moduleRoleIds.includes(roleId))
        }))
      );
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de la suppression du module";
      setError(message);
      console.error(message);
    }
  };

  const addRole = async (role: Omit<Role, "id">) => {
    try {
      const createdRole = await apiRequest<Role>("/roles", {
        method: "POST",
        body: role
      });

      setRoles((previous) => [...previous, createdRole]);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de l'ajout du rôle";
      setError(message);
      console.error(message);
    }
  };

  const updateRole = async (id: number, updatedRole: Partial<Role>) => {
    try {
      const savedRole = await apiRequest<Role>(`/roles/${id}`, {
        method: "PUT",
        body: updatedRole
      });

      setRoles((previous) => previous.map((role) => (role.id === id ? savedRole : role)));
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de la modification du rôle";
      setError(message);
      console.error(message);
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await apiRequest<{ message: string }>(`/roles/${id}`, { method: "DELETE" });

      setRoles((previous) => previous.filter((role) => role.id !== id));
      setUsers((previous) =>
        previous.map((user) => ({
          ...user,
          assignedRoles: user.assignedRoles?.filter((roleId) => roleId !== id)
        }))
      );
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de la suppression du rôle";
      setError(message);
      console.error(message);
    }
  };

  const assignModuleToAgent = async (agentId: number, moduleId: number) => {
    try {
      const assignment = await apiRequest<AgentModule>("/agent-modules", {
        method: "POST",
        body: { agentId, moduleId }
      });

      setAgentModules((previous) => {
        const exists = previous.some((am) => am.agentId === agentId && am.moduleId === moduleId);
        return exists ? previous : [...previous, assignment];
      });

      setUsers((previous) =>
        previous.map((user) => {
          if (user.id !== agentId) return user;
          const currentModules = user.modules || [];
          return currentModules.includes(moduleId)
            ? user
            : { ...user, modules: [...currentModules, moduleId] };
        })
      );
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de l'attribution du module";
      setError(message);
      console.error(message);
    }
  };

  const removeModuleFromAgent = async (agentId: number, moduleId: number) => {
    try {
      await apiRequest<{ message: string }>(`/agent-modules/${agentId}/${moduleId}`, { method: "DELETE" });

      const moduleRoleIds = roles.filter((role) => role.moduleId === moduleId).map((role) => role.id);

      setAgentModules((previous) =>
        previous.filter((am) => !(am.agentId === agentId && am.moduleId === moduleId))
      );

      setUsers((previous) =>
        previous.map((user) => {
          if (user.id !== agentId) return user;
          return {
            ...user,
            modules: user.modules?.filter((id) => id !== moduleId),
            assignedRoles: user.assignedRoles?.filter((roleId) => !moduleRoleIds.includes(roleId))
          };
        })
      );
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors du retrait du module";
      setError(message);
      console.error(message);
    }
  };

  const assignRoleToAgent = async (agentId: number, roleId: number) => {
    try {
      const updatedUser = await apiRequest<User>(`/users/${agentId}/roles/${roleId}`, { method: "PATCH" });
      setUsers((previous) => previous.map((user) => (user.id === agentId ? updatedUser : user)));

      const role = roles.find((item) => item.id === roleId);
      if (role) {
        setAgentModules((previous) => {
          const exists = previous.some((am) => am.agentId === agentId && am.moduleId === role.moduleId);
          return exists ? previous : [...previous, { agentId, moduleId: role.moduleId }];
        });
      }
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors de l'attribution du rôle";
      setError(message);
      console.error(message);
    }
  };

  const removeRoleFromAgent = async (agentId: number, roleId: number) => {
    try {
      const updatedUser = await apiRequest<User>(`/users/${agentId}/roles/${roleId}`, { method: "DELETE" });
      setUsers((previous) => previous.map((user) => (user.id === agentId ? updatedUser : user)));
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : "Erreur lors du retrait du rôle";
      setError(message);
      console.error(message);
    }
  };

  const getAgentModules = (agentId: number): Module[] => {
    const user = users.find((u) => u.id === agentId);
    const explicitModuleIds = agentModules.filter((am) => am.agentId === agentId).map((am) => am.moduleId);
    const userModuleIds = user?.modules || [];
    const roleModuleIds = roles
      .filter((role) => (user?.assignedRoles || []).includes(role.id))
      .map((role) => role.moduleId);

    const moduleIds = Array.from(new Set([...explicitModuleIds, ...userModuleIds, ...roleModuleIds]));
    return modules.filter((module) => moduleIds.includes(module.id));
  };

  const getAgentRoles = (agentId: number): Role[] => {
    const user = users.find((u) => u.id === agentId);
    const roleIds = user?.assignedRoles || [];
    return roles.filter((role) => roleIds.includes(role.id));
  };

  const getModuleRoles = (moduleId: number): Role[] => {
    return roles.filter((role) => role.moduleId === moduleId);
  };

  const getRolesByModuleId = (moduleId: number): Role[] => {
    return getModuleRoles(moduleId);
  };

  return (
    <DataContext.Provider
      value={{
        modules,
        roles,
        users,
        agentModules,
        loading,
        error,
        refreshData,
        addModule,
        updateModule,
        deleteModule,
        addRole,
        updateRole,
        deleteRole,
        assignModuleToAgent,
        removeModuleFromAgent,
        assignRoleToAgent,
        removeRoleFromAgent,
        getAgentModules,
        getAgentRoles,
        getModuleRoles,
        getRolesByModuleId
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
