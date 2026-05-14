
import { Role, User } from "../types/dataTypes";

export const addRole = (
  roles: Role[], 
  newRole: Omit<Role, "id">
): Role[] => {
  const newId = Math.max(0, ...roles.map((r) => r.id)) + 1;
  return [...roles, { ...newRole, id: newId }];
};

export const updateRole = (
  roles: Role[],
  id: number,
  updatedRole: Partial<Role>
): Role[] => {
  return roles.map((role) =>
    role.id === id ? { ...role, ...updatedRole } : role
  );
};

export const deleteRole = (
  roles: Role[],
  users: User[],
  id: number
): {
  roles: Role[];
  users: User[];
} => {
  const updatedRoles = roles.filter((role) => role.id !== id);
  
  // Update users who had this role assigned
  const updatedUsers = users.map((user) => {
    if (user.assignedRoles && user.assignedRoles.includes(id)) {
      return {
        ...user,
        assignedRoles: user.assignedRoles.filter((roleId) => roleId !== id)
      };
    }
    return user;
  });

  return {
    roles: updatedRoles,
    users: updatedUsers
  };
};
