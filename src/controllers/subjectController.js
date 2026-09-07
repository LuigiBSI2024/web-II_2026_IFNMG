import prisma from "../config/database.js";

const publicSubjectSelect = 
{
    nome: true,
    ativa: true,
    professor: {
        select: { 
          nome: true, 
          email: true, 
          foto: true, 
          createdAt: true,
          subjects: { 
            select: { 
              nome: true
            }
          }
        }     
    },

  createdAt: true
};

// CREATE - Criar nova disciplina.
export const create = async (req, res) => {
  try {
    const { nome, professorId } = req.body;

    const nomeInvalido = typeof nome !== "string" || nome.trim() === "";
    const professorIdInvalido = typeof professorId !== "number" || !Number.isInteger(professorId) || professorId <= 0;

    if (nomeInvalido || professorIdInvalido) {
        return res.status(400).json(
            {
                success: false,
                message: "Nome e ID do professor são obrigatórios e devem ser válidos.",
            }
        );
    }

    const professorExistente = await prisma.user.findUnique(
        {
            where: { id: professorId },
        }
    );

    if (!professorExistente) {
        return res.status(404).json(
            {
                success: false,
                message: "Professor não encontrado no sistema. Verifique o ID fornecido.",
            }
        );
    }

    const novaDisciplina = await prisma.subject.create({
      data: {
        nome: nome.trim(),
        professorId: professorId,
      },
      select: publicSubjectSelect,
    });

    return res.status(201).json({
      success: true,
      message: "Disciplina criada com sucesso",
      data: novaDisciplina,
    });
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Disciplina já cadastrada no sistema",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao criar disciplina",
    });
  }
};

// READ - Listar todas as disciplinas
export const getAll = async (_req, res) => {
  try {
    const disciplinas = await prisma.subject.findMany({
      select: publicSubjectSelect,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: disciplinas,
      total: disciplinas.length,
    });
  } catch (error) {
    console.error("Erro ao listar disciplinas:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao listar disciplinas",
    });
  }
};

// READ - Buscar disciplina por ID
export const getById = async (req, res) => {
  try {
    const subjectId = Number(req.params.id);

    if (!subjectId || !Number.isInteger(subjectId) || subjectId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const disciplina = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: publicSubjectSelect,
    });

    if (!disciplina) {
      return res.status(404).json({
        success: false,
        message: `Disciplina com ID ${subjectId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: disciplina,
    });
  } catch (error) {
    console.error("Erro ao buscar disciplina:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar disciplina",
    });
  }
};
