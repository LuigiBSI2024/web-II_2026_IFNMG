//src/app.js
import express from "express";
import prisma from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "API do Gerador de Provas",
      timestamp: new Date().toISOString(),
      services: {
        api: "OK",
        database: { status: "OK" },
      },
    });
  } catch (error) {
    console.error("Erro na verificação do banco:", error);

    res.status(503).json({
      status: "DEGRADED",
      message: "API do Gerador de Provas",
      services: {
        api: "OK",
        database: { status: "ERROR" },
      },
    });
  }
});

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/subjects", subjectRoutes);
app.use(
  (req, res) => {
    res.status(404).json(
      {
        success: false,
        message: "Rota " + req.method + " " + req.originalUrl + " não encontrada",
      }
    );
  }
);

app.use((err, req, res, next) => 
  {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json(
        {
          success: false,
          error: {
            code: 'BadRequest',
            message: 'O corpo da requisição contém um JSON com sintaxe inválida.'
          }
        }
      );
    }

    return res.status(500).json(
      {
        success: false,
        message: 'Erro interno do servidor'
      }
    );
  }
);

export default app;
