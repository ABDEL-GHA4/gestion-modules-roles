import express from "express";
import { createModule, deleteModule, getModules, updateModule } from "../controllers/module.controller";

const router = express.Router();

router.get("/", getModules);
router.post("/", createModule);
router.put("/:id", updateModule);
router.delete("/:id", deleteModule);

export default router;
