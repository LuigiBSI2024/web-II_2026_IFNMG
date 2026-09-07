import prisma from "../config/database.js";

const publicQuestionSelect = {
  id: true,
  enunciado: true,
  dificuldade: true,
  respostaCorreta: true,
  ativa: true,
  createdAt: true,
  updatedAt: true,
  subject: {
    select: {
      nome: true,
      updatedAt: true
    },
  },
  author: {
    select: {
      nome: true,
      email: true,
      papel: true,
      foto: true
    },
  }
};

export const create = async (req, res) => {
  try {
    const { enunciado, dificuldade, respostaCorreta, subjectId, authorId } = req.body;

    const enunciadoInvalido = typeof enunciado !== "string" || enunciado.trim() === "";
    const dificuldadeInvalida = typeof dificuldade !== "number" || !Number.isInteger(dificuldade);
    const subjectIdInvalido = typeof subjectId !== "number" || !Number.isInteger(subjectId) || subjectId <= 0;
    const authorIdInvalido = typeof authorId !== "number" || !Number.isInteger(authorId) || authorId <= 0;

    if (enunciadoInvalido || dificuldadeInvalida || subjectIdInvalido || authorIdInvalido) {
      return res.status(400).json({
        success: false,
        message: "Dados de entrada inválidos. Verifique os campos fornecidos.",
      });
    }

    if(dificuldade > 3 || dificuldade < 1) {
      return res.status(400).json(
        {
          success: false,
          message: "A dificuldade deve ser um número inteiro entre 1 e 3."
        }
      );
    }

    const novaQuestao = await prisma.question.create({
      data: {
        enunciado: enunciado.trim(),
        dificuldade,
        respostaCorreta: respostaCorreta ? respostaCorreta.trim() : null,
        subjectId,
        authorId,
      },
      select: publicQuestionSelect,
    });

    return res.status(201).json({
      success: true,
      message: "Questão criada com sucesso",
      data: novaQuestao,
    });
  } catch (error) {
    console.error("Erro ao criar questão:", error);

    // P2003: Falha de chave estrangeira (subjectId ou authorId inexistentes)
    if (error.code === "P2003") {
      return res.status(404).json({
        success: false,
        message: "Disciplina ou autor não encontrado no sistema.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro ao criar questão",
    });
  }
};

export const getAll = async (_req, res) => {
  try {
    const questoes = await prisma.question.findMany({
      select: publicQuestionSelect,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: questoes,
      total: questoes.length,
    });
  } catch (error) {
    console.error("Erro ao listar questões:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao listar questões",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const questionId = Number(req.params.id);

    if (!questionId || !Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID inválido. Deve ser um número inteiro positivo",
      });
    }

    const questao = await prisma.question.findUnique({
      where: { id: questionId },
      select: publicQuestionSelect,
    });

    if (!questao) {
      return res.status(404).json({
        success: false,
        message: `Questão com ID ${questionId} não encontrada`,
      });
    }

    return res.status(200).json({
      success: true,
      data: questao,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar questão",
    });
  }
};