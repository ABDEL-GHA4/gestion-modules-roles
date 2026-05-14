import type { RequestHandler } from "express";
import AgentModule from "../models/AgentModule";
import Module from "../models/Module";
import Role from "../models/Role";
import User from "../models/User";

type AgentModuleBody = {
  agentId?: number;
  moduleId?: number;
};

export const assignModuleToAgent: RequestHandler = async (req, res, next) => {
  try {
    const { agentId, moduleId } = req.body as AgentModuleBody;

    if (agentId === undefined || moduleId === undefined) {
      res.status(400).json({ message: "agentId and moduleId are required" });
      return;
    }

    const [user, moduleExists] = await Promise.all([
      User.findOne({ id: agentId }),
      Module.exists({ id: moduleId })
    ]);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!moduleExists) {
      res.status(404).json({ message: "Module not found" });
      return;
    }

    const agentModule = await AgentModule.findOneAndUpdate(
      { agentId, moduleId },
      { agentId, moduleId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await User.findOneAndUpdate({ id: agentId }, { $addToSet: { modules: moduleId } });

    res.status(201).json(agentModule);
  } catch (error) {
    next(error);
  }
};

export const removeModuleFromAgent: RequestHandler = async (req, res, next) => {
  try {
    const agentId = Number(req.params.agentId);
    const moduleId = Number(req.params.moduleId);

    await AgentModule.findOneAndDelete({ agentId, moduleId });

    const moduleRoles = await Role.find({ moduleId }).select("id");
    const moduleRoleIds = moduleRoles.map((role) => role.id);

    await User.findOneAndUpdate(
      { id: agentId },
      { $pull: { modules: moduleId, assignedRoles: { $in: moduleRoleIds } } }
    );

    res.json({ message: "Module removed from user successfully" });
  } catch (error) {
    next(error);
  }
};

export const assignRoleToAgent: RequestHandler = async (req, res, next) => {
  try {
    const agentId = Number(req.params.agentId);
    const roleId = Number(req.params.roleId);

    const role = await Role.findOne({ id: roleId });
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    const user = await User.findOneAndUpdate(
      { id: agentId },
      { $addToSet: { assignedRoles: roleId, modules: role.moduleId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await AgentModule.findOneAndUpdate(
      { agentId, moduleId: role.moduleId },
      { agentId, moduleId: role.moduleId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const removeRoleFromAgent: RequestHandler = async (req, res, next) => {
  try {
    const agentId = Number(req.params.agentId);
    const roleId = Number(req.params.roleId);

    const user = await User.findOneAndUpdate(
      { id: agentId },
      { $pull: { assignedRoles: roleId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
