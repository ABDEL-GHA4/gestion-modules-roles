import type { RequestHandler } from "express";
import Module from "../models/Module";
import Role from "../models/Role";
import User from "../models/User";
import AgentModule from "../models/AgentModule";

type ModuleBody = {
  name?: string;
  description?: string;
};

const getNextModuleId = async (): Promise<number> => {
  const lastModule = await Module.findOne().sort({ id: -1 });
  return (lastModule?.id || 0) + 1;
};

export const getModules: RequestHandler = async (_req, res, next) => {
  try {
    const modules = await Module.find().sort({ id: 1 });
    res.json(modules);
  } catch (error) {
    next(error);
  }
};

export const createModule: RequestHandler = async (req, res, next) => {
  try {
    const { name, description } = req.body as ModuleBody;

    if (!name) {
      res.status(400).json({ message: "Module name is required" });
      return;
    }

    const module = await Module.create({
      id: await getNextModuleId(),
      name,
      description: description || ""
    });

    res.status(201).json(module);
  } catch (error) {
    next(error);
  }
};

export const updateModule: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body as ModuleBody;

    const module = await Module.findOneAndUpdate(
      { id },
      { ...(name !== undefined ? { name } : {}), ...(description !== undefined ? { description } : {}) },
      { new: true, runValidators: true }
    );

    if (!module) {
      res.status(404).json({ message: "Module not found" });
      return;
    }

    res.json(module);
  } catch (error) {
    next(error);
  }
};

export const deleteModule: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedModule = await Module.findOneAndDelete({ id });

    if (!deletedModule) {
      res.status(404).json({ message: "Module not found" });
      return;
    }

    const removedRoles = await Role.find({ moduleId: id }).select("id");
    const removedRoleIds = removedRoles.map((role) => role.id);

    await Promise.all([
      Role.deleteMany({ moduleId: id }),
      AgentModule.deleteMany({ moduleId: id }),
      User.updateMany({}, { $pull: { modules: id, assignedRoles: { $in: removedRoleIds } } })
    ]);

    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    next(error);
  }
};
