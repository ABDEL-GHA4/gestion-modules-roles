
import { AgentModule, Module, Role, User } from "../types/dataTypes";

export const getAgentModules = (
  modules: Module[],
  agentModules: AgentModule[],
  agentId: number
): Module[] => {
  const moduleIds = agentModules
    .filter((am) => am.agentId === agentId)
    .map((am) => am.moduleId);
  
  return modules.filter((module) => moduleIds.includes(module.id));
};

export const getAgentRoles = (
  roles: Role[],
  users: User[],
  agentId: number
): Role[] => {
  const user = users.find((u) => u.id === agentId);
  const roleIds = user?.assignedRoles || [];
  return roles.filter((role) => roleIds.includes(role.id));
};

export const getModuleRoles = (
  roles: Role[],
  moduleId: number
): Role[] => {
  return roles.filter((role) => role.moduleId === moduleId);
};
