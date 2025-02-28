import z from 'zod'

export const dashboardZodSchema = z.object({
	totalFixedExpenses: z.number(),
})

export type DashboardData = z.infer<typeof dashboardZodSchema>
