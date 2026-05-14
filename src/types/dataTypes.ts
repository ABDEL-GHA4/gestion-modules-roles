export interface Module {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  label: string;
  moduleId: number;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: "admin" | "manager" | "agent";
  modules?: number[];
  assignedRoles?: number[];
}

export interface AgentModule {
  agentId: number;
  moduleId: number;
}

export interface AppData {
  modules: Module[];
  roles: Role[];
  users: User[];
  agentModules: AgentModule[];
}

export interface DataContextType {
  modules: Module[];
  roles: Role[];
  users: User[];
  agentModules: AgentModule[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addModule: (module: Omit<Module, "id">) => void;
  updateModule: (id: number, module: Partial<Module>) => void;
  deleteModule: (id: number) => void;
  addRole: (role: Omit<Role, "id">) => void;
  updateRole: (id: number, role: Partial<Role>) => void;
  deleteRole: (id: number) => void;
  assignModuleToAgent: (agentId: number, moduleId: number) => void;
  removeModuleFromAgent: (agentId: number, moduleId: number) => void;
  assignRoleToAgent: (agentId: number, roleId: number) => void;
  removeRoleFromAgent: (agentId: number, roleId: number) => void;
  getAgentModules: (agentId: number) => Module[];
  getAgentRoles: (agentId: number) => Role[];
  getModuleRoles: (moduleId: number) => Role[];
  getRolesByModuleId: (moduleId: number) => Role[];
}
