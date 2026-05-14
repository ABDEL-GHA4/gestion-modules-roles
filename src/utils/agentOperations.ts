
import { AgentModule, Module, Role, User } from "../types/dataTypes";

export const assignModuleToAgent = (
  agentModules: AgentModule[],
  agentId: number,
  moduleId: number
): AgentModule[] => {
  const exists = agentModules.some(
    (am) => am.agentId === agentId && am.moduleId === moduleId
  );
  
  if (!exists) {
    return [...agentModules, { agentId, moduleId }];
  }
  
  return agentModules;
};

export const removeModuleFromAgent = (
  agentModules: AgentModule[],
  roles: Role[],
  users: User[],
  agentId: number,
  moduleId: number
): {
  agentModules: AgentModule[];
  users: User[];
} => {
  const updatedAgentModules = agentModules.filter(
    (am) => !(am.agentId === agentId && am.moduleId === moduleId)
  );
  
  // Also remove roles from this module
  const moduleRoleIds = roles
    .filter((role) => role.moduleId === moduleId)
    .map((role) => role.id);
  
  const updatedUsers = users.map((user) => {
    if (user.id === agentId && user.assignedRoles) {
      return {
        ...user,
        assignedRoles: user.assignedRoles.filter(
          (roleId) => !moduleRoleIds.includes(roleId)
        )
      };
    }
    return user;
  });

  return {
    agentModules: updatedAgentModules,
    users: updatedUsers
  };
};

export const assignRoleToAgent = (
  users: User[],
  agentId: number,
  roleId: number
): User[] => {
  return users.map((user) => {
    if (user.id === agentId) {
      const currentRoles = user.assignedRoles || [];
      if (!currentRoles.includes(roleId)) {
        return {
          ...user,
          assignedRoles: [...currentRoles, roleId]
        };
      }
    }
    return user;
  });
};

export const removeRoleFromAgent = (
  users: User[],
  agentId: number,
  roleId: number
): User[] => {
  return users.map((user) => {
    if (user.id === agentId && user.assignedRoles) {
      return {
        ...user,
        assignedRoles: user.assignedRoles.filter((id) => id !== roleId)
      };
    }
    return user;
  });
};
