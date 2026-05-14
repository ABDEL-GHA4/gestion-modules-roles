import express from "express";
import {
  assignModulesToAgent,
  getAllManagers,
  getManagerAgents,
  getManagerModules
} from "../controllers/manager.controller";

const router = express.Router();

router.get("/", getAllManagers);
router.get("/:id/agents", getManagerAgents);
router.get("/:id/modules", getManagerModules);
router.put("/:managerId/agents/:agentId/modules", assignModulesToAgent);

export default router;
