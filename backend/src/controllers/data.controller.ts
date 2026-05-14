import type { RequestHandler } from "express";
import User from "../models/User";
import Module from "../models/Module";
import Role from "../models/Role";
import AgentModule from "../models/AgentModule";

export const getAllData: RequestHandler = async (_req, res, next) => {
  try {
    const [users, modules, roles, agentModules] = await Promise.all([
      User.find().sort({ id: 1 }),
      Module.find().sort({ id: 1 }),
      Role.find().sort({ id: 1 }),
      AgentModule.find().sort({ agentId: 1, moduleId: 1 })
    ]);

    res.json({ users, modules, roles, agentModules });
  } catch (error) {
    next(error);
  }
};
