import z from 'zod'

const spentsByCategoryZodObject = z.object({
	category: z.string(),
	spent: z.number().optional(),
})

export const chartsZodSchema = z.object({
	spentsByCategory: z.array(spentsByCategoryZodObject),
})
