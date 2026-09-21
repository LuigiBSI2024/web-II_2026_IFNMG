import { z } from "zod";

// ID que aceita número positivo (com limite de int32) OU string.
const idSchema = 
  z.number()
  .int()
  .positive("ID deve ser positivo")
  .lte(2147483647, "ID deve ser menor ou igual a 2147483647")
  .or(z.string().trim());

const dificuldadeSchema =
  z.number()
  .int()
  .refine(
    val => 
      {
        return val > 0 && val <= 3
      },
      {message: "O valor deve ser entre 1 e 3."}
  );

const respostaCorretaSchema = 
  z.string()
  .trim()
  .min(1, "A resposta precisa ter ao menos 1 caractere. ")
  .max(500, "A resposta pode ser composta até por 500 caracteres.")
  .nullable()
  .optional();

/** Schema para POST /users */
export const createQuestionSchema = 
  z.object(
    {
      enunciado: 
        z.string()
          .trim()
          .min(3, "Enunciado deve ter pelo menos 3 caracteres")
          .max(500, "Enunciado deve ter no máximo 500 caracteres"),
      dificuldade: dificuldadeSchema,
      respostaCorreta: respostaCorretaSchema,
      subjectId: idSchema, 
      authorId: idSchema,
      ativa: z.boolean().default(false)
    }
  )
  .strict();

/** Schema para PATCH /users/:id */
export const updateQuestionSchema = 
  z.object(
    {
      id: idSchema,
      enunciado: 
        z.string()
          .trim()
          .min(3, "Nome deve ter pelo menos 3 caracteres")
          .max(500, "Nome deve ter no máximo 100 caracteres")
          .optional(),
      dificuldade: dificuldadeSchema.optional(),
      respostaCorreta: respostaCorretaSchema,
      subjectId: idSchema.optional(), 
      authorId: idSchema.optional(),
      ativa: z.boolean().optional()
    }
  )
  .strict()
  .refine(
    (data) => {
      const {id, ...fieldsToUpdate} = data;
      return Object.keys(fieldsToUpdate).length > 0;
    },
    { message: "Envie pelo menos um campo para atualização" }
  );

export const getQuestionQuerySchema = 
  z.object(
    {
      nome: z.string().trim().optional(),
      professorId: idSchema.optional(),
      ativa: z.coerce.boolean().optional() // z.coerce converte "true"/"false" da URL em boolean.
    }
  );

export const deleteQuestion =
  z.object(
    {
      id: idSchema,
    }
  );
  