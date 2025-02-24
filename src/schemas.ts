import z from "zod";

export const categoryZodSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string().optional()
})

export type Category = z.infer<typeof categoryZodSchema>

export const transactionZodSchema = z.object({
  id: z.number().optional(),
  categoryId: z.number(),
  category: categoryZodSchema.optional(),
  title: z.string(),
  movement: z.enum(['income', 'outgoing']),
  valueInCents: z.number(),
  date: z.string().optional(),
  isFixed: z.boolean().default(false),
  isPaid: z.boolean().default(false)
})

export type Transaction = z.infer<typeof transactionZodSchema>