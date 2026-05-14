import User from "../models/User";
import Module from "../models/Module";
import Role from "../models/Role";
import AgentModule from "../models/AgentModule";
import { initialAgentModules, initialModules, initialRoles, initialUsers } from "./initialData";

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  const usersCount = await User.countDocuments();

  if (usersCount > 0) {
    return;
  }

  await Module.insertMany(initialModules);
  await Role.insertMany(initialRoles);

  for (const user of initialUsers) {
    await User.create(user);
  }

  await AgentModule.insertMany(initialAgentModules);
  console.log("Database seeded with default modules, roles, users and assignments");
};
