import type { RequestHandler } from "express";
import Module from "../models/Module";
import Role from "../models/Role";
import User from "../models/User";

type RoleBody = {
  name?: string;
  label?: string;
  moduleId?: number;
};

const getNextRoleId = async (): Promise<number> => {
  const lastRole = await Role.findOne().sort({ id: -1 });
  return (lastRole?.id || 0) + 1;
};

export const getRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await Role.find().sort({ id: 1 });
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const createRole: RequestHandler = async (req, res, next) => {
  try {
    const { name, label, moduleId } = req.body as RoleBody;

    if (!name || !label || moduleId === undefined) {
      res.status(400).json({ message: "Name, label and moduleId are required" });
      return;
    }

    const moduleExists = await Module.exists({ id: moduleId });
    if (!moduleExists) {
      res.status(404).json({ message: "Module not found" });
      return;
    }

    const role = await Role.create({ id: await getNextRoleId(), name, label, moduleId });
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

export const updateRole: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, label, moduleId } = req.body as RoleBody;

    if (moduleId !== undefined) {
      const moduleExists = await Module.exists({ id: moduleId });
      if (!moduleExists) {
        res.status(404).json({ message: "Module not found" });
        return;
      }
    }

    const role = await Role.findOneAndUpdate(
      { id },
      {
        ...(name !== undefined ? { name } : {}),
        ...(label !== undefined ? { label } : {}),
        ...(moduleId !== undefined ? { moduleId } : {})
      },
      { new: true, runValidators: true }
    );

    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const deleteRole: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedRole = await Role.findOneAndDelete({ id });

    if (!deletedRole) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    await User.updateMany({}, { $pull: { assignedRoles: id } });
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    next(error);
  }
};
