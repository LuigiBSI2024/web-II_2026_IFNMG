import { z } from "zod";

// ID que aceita número positivo (com limite de int32) OU string.
const idSchema = 
  z.number()
  .int()
  .positive("ID deve ser positivo")
  .lte(2147483647, "ID deve ser menor ou igual a 2147483647")
  .or(z.string().trim());

/** Schema para POST /subjects */
export const createSubjectSchema = 
  z.object(
    {
      nome: 
        z.string()
          .trim()
          .min(3, "Nome deve ter pelo menos 3 caracteres")
          .max(100, "Nome deve ter no máximo 100 caracteres"),
      professorId: idSchema,
      ativa: z.boolean().default(false).optional()
    }
  )
  .strict();

/** Schema para PATCH /subjects/:id */
export const updateSubjectSchema = 
  z.object(
    {
      id: idSchema,
      nome: 
        z.string()
          .trim()
          .min(3, "Nome deve ter pelo menos 3 caracteres")
          .max(100, "Nome deve ter no máximo 100 caracteres")
          .optional(),
      professorId: idSchema.optional(),
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

export const getSubjectQuerySchema = 
  z.object(
    {
      nome: z.string().trim().optional(),
      professorId: idSchema.optional(),
      ativa: z.coerce.boolean().optional() // z.coerce converte "true"/"false" da URL em boolean.
    }
  );

export const deleteSubject =
  z.object(
    {
      id: idSchema,
    }
  );

  