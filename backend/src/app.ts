import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import agentModulesRoutes from "./routes/agentModules.routes";
import authRoutes from "./routes/auth.routes";
import dataRoutes from "./routes/data.routes";
import managerRoutes from "./routes/manager.routes";
import modulesRoutes from "./routes/modules.routes";
import rolesRoutes from "./routes/roles.routes";
import usersRoutes from "./routes/users.routes";

const app = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:8080";

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Modules & Roles API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/modules", modulesRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/agent-modules", agentModulesRoutes);
app.use("/api/managers", managerRoutes);

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  console.error(error);

  const message = error instanceof Error ? error.message : "Server error";
  res.status(500).json({ message });
};

app.use(errorHandler);

export default app;