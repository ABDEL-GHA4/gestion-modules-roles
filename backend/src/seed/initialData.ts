import type { IUser } from "../models/User";
import type { IModule } from "../models/Module";
import type { IRole } from "../models/Role";
import type { IAgentModule } from "../models/AgentModule";

export const initialUsers: IUser[] = [
  { id: 1, username: "admin", password: "admin123", role: "admin", modules: [], assignedRoles: [] },
  { id: 2, username: "manager1", password: "manager123", role: "manager", modules: [1, 2], assignedRoles: [] },
  { id: 3, username: "manager2", password: "manager123", role: "manager", modules: [2], assignedRoles: [] },
  { id: 4, username: "manager3", password: "manager123", role: "manager", modules: [], assignedRoles: [] },
  { id: 5, username: "agent1", password: "agent123", role: "agent", modules: [], assignedRoles: [1] },
  { id: 6, username: "agent2", password: "agent123456", role: "agent", modules: [], assignedRoles: [2] },
  { id: 7, username: "agent3", password: "agent123", role: "agent", modules: [], assignedRoles: [3] }
];

export const initialModules: IModule[] = [
  { id: 1, name: "Gestion du Parking", description: "Module pour la gestion du parking" },
  { id: 2, name: "Gestion des Stocks", description: "Module pour la gestion des stocks" },
  { id: 3, name: "Comptabilité", description: "Module pour la comptabilité" }
];

export const initialRoles: IRole[] = [
  { id: 1, name: "GST", label: "Gestionnaire", moduleId: 1 },
  { id: 2, name: "DEV", label: "Développement", moduleId: 2 },
  { id: 3, name: "ADM", label: "Administrateur", moduleId: 1 },
  { id: 4, name: "AUD", label: "Auditeur", moduleId: 2 },
  { id: 5, name: "VND", label: "Vendeur", moduleId: 2 }
];

export const initialAgentModules: IAgentModule[] = [
  { agentId: 4, moduleId: 1 },
  { agentId: 4, moduleId: 2 },
  { agentId: 5, moduleId: 2 }
];
