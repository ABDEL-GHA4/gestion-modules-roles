import type { RequestHandler } from "express";
import User from "../models/User";
import Module from "../models/Module";
import AgentModule from "../models/AgentModule";

export const getAllManagers: RequestHandler = async (_req, res, next) => {
  try {
    const managers = await User.find({ role: "manager" }).sort({ id: 1 });
    res.json(managers);
  } catch (error) {
    next(error);
  }
};

export const getManagerAgents: RequestHandler = async (_req, res, next) => {
  try {
    const agents = await User.find({ role: "agent" }).sort({ id: 1 });
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

export const getManagerModules: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const manager = await User.findOne({ id, role: "manager" });

    if (!manager) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }

    const modules = await Module.find({ id: { $in: manager.modules } }).sort({ id: 1 });
    res.json(modules);
  } catch (error) {
    next(error);
  }
};

export const assignModulesToAgent: RequestHandler = async (req, res, next) => {
  try {
    const managerId = Number(req.params.managerId);
    const agentId = Number(req.params.agentId);
    const body = req.body as { modules?: number[] };
    const modules = body.modules || [];

    const manager = await User.findOne({ id: managerId, role: "manager" });
    if (!manager) {
      res.status(404).json({ message: "Manager not found" });
      return;
    }

    const allowedModules = modules.filter((moduleId) => manager.modules.includes(moduleId));

    await AgentModule.deleteMany({ agentId });
    await AgentModule.insertMany(allowedModules.map((moduleId) => ({ agentId, moduleId })));

    const agent = await User.findOneAndUpdate(
      { id: agentId },
      { modules: allowedModules },
      { new: true }
    );

    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    res.json(agent);
  } catch (error) {
    next(error);
  }
};
