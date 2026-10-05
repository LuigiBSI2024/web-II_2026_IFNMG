import express from "express";
import userRoutes from "./userRoutes.js";
import questionRoutes from "./questions/questionRoutes.js";
import subjectRoutes from "./subjects/subjectRoutes.js";

const router = express.Router();

/** Rotas públicas da primeira versão da API. */
router.use("/users", userRoutes);
router.use("/questions", questionRoutes);
router.use("/subjects", subjectRoutes);

/** Confirma que o grupo de rotas da V1 está montado. */
router.get("/health", (_req, res) => {
  res.status(200).json({
    version: "v1",
    status: "OK",
    message: "API v1 do Gerador de Provas",
  });
});

export default router;
