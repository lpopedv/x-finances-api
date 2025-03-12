import z from 'zod'

export const dashboardZodSchema = z.object({
	totalFixedExpenses: z.number(),
	totalMonthlyExpenses: z.number(),
	totalNextMonthExpenses: z.number(),
})

export type DashboardData = z.infer<typeof dashboardZodSchema>
