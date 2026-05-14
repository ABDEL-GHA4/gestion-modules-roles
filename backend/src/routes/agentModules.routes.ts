import express from "express";
import { assignModuleToAgent, removeModuleFromAgent } from "../controllers/assignment.controller";

const router = express.Router();

router.post("/", assignModuleToAgent);
router.delete("/:agentId/:moduleId", removeModuleFromAgent);

export default router;
