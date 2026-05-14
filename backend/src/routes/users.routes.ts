import express from "express";
import { assignRoleToAgent, removeRoleFromAgent } from "../controllers/assignment.controller";
import { getUsers } from "../controllers/user.controller";

const router = express.Router();

router.get("/", getUsers);
router.patch("/:agentId/roles/:roleId", assignRoleToAgent);
router.delete("/:agentId/roles/:roleId", removeRoleFromAgent);

export default router;
