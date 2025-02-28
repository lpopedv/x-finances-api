import z from 'zod'

export const categoryZodSchema = z.object({
	id: z.number().optional(),
	title: z.string(),
	description: z.string().optional(),
})

export type Category = z.infer<typeof categoryZodSchema>
