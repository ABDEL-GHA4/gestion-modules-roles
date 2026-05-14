
import { Module, Role, User, AgentModule } from "../types/dataTypes";

export const saveData = (
  modules: Module[],
  roles: Role[],
  users: User[],
  agentModules: AgentModule[]
): void => {
  const dataToSave = {
    modules,
    roles,
    users,
    agentModules
  };
  localStorage.setItem("appData", JSON.stringify(dataToSave));
};

export const loadData = (defaultData: {
  modules: Module[],
  roles: Role[],
  users: User[],
  agentModules: AgentModule[]
}): {
  modules: Module[],
  roles: Role[],
  users: User[],
  agentModules: AgentModule[]
} => {
  const storedData = localStorage.getItem("appData");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    return {
      modules: parsedData.modules || defaultData.modules,
      roles: parsedData.roles || defaultData.roles,
      users: parsedData.users || defaultData.users,
      agentModules: parsedData.agentModules || defaultData.agentModules
    };
  }
  return defaultData;
};
