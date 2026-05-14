
import { Module, Role, User, AgentModule } from "../types/dataTypes";

export const addModule = (
  modules: Module[],
  newModule: Omit<Module, "id">
): Module[] => {
  const newId = Math.max(0, ...modules.map((m) => m.id)) + 1;
  return [...modules, { ...newModule, id: newId }];
};

export const updateModule = (
  modules: Module[],
  id: number,
  updatedModule: Partial<Module>
): Module[] => {
  return modules.map((module) =>
    module.id === id ? { ...module, ...updatedModule } : module
  );
};

export const deleteModule = (
  modules: Module[],
  roles: Role[],
  agentModules: AgentModule[],
  users: User[],
  id: number
): {
  modules: Module[];
  roles: Role[];
  agentModules: AgentModule[];
  users: User[];
} => {
  const updatedModules = modules.filter((module) => module.id !== id);
  const updatedRoles = roles.filter((role) => role.moduleId !== id);
  const updatedAgentModules = agentModules.filter((am) => am.moduleId !== id);
  
  // Update users who had this module assigned
  const updatedUsers = users.map((user) => {
    if (user.modules && user.modules.includes(id)) {
      return {
        ...user,
        modules: user.modules.filter((moduleId) => moduleId !== id)
      };
    }
    return user;
  });

  return {
    modules: updatedModules,
    roles: updatedRoles,
    agentModules: updatedAgentModules,
    users: updatedUsers
  };
};
