import dotenv from "dotenv";
import { connectDB } from "../config/db";
import User from "../models/User";
import Module from "../models/Module";
import Role from "../models/Role";
import AgentModule from "../models/AgentModule";
import { initialAgentModules, initialModules, initialRoles, initialUsers } from "./initialData";

dotenv.config();

const runSeed = async (): Promise<void> => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Module.deleteMany({}),
    Role.deleteMany({}),
    AgentModule.deleteMany({})
  ]);

  await Module.insertMany(initialModules);
  await Role.insertMany(initialRoles);

  for (const user of initialUsers) {
    await User.create(user);
  }

  await AgentModule.insertMany(initialAgentModules);

  console.log("Database reset and seeded successfully");
  process.exit(0);
};

runSeed().catch((error: unknown) => {
  console.error("Seed error:", error);
  process.exit(1);
});
