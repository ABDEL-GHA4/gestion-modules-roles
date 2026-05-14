import express from "express";
import { getAllData } from "../controllers/data.controller";

const router = express.Router();

router.get("/", getAllData);

export default router;
