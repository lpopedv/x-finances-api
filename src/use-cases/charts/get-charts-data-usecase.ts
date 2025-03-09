import { startOfMonth, endOfMonth } from 'date-fns'
import { prisma } from '~/database/prisma-client'

const handle = async () => {
	const spentsByCategory = await getSpentsByCategory()

	return {
		spentsByCategory,
	}
}

const getSpentsByCategory = async () => {
	const startDate = startOfMonth(new Date())
	const endDate = endOfMonth(new Date())

	const transactions = await prisma.transaction.groupBy({
		by: ['categoryId'],
		where: {
			movement: 'outgoing',
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
		_sum: {
			valueInCents: true,
		},
		orderBy: {
			_sum: { valueInCents: 'desc' },
		},
	})

	const categories = await prisma.category.findMany({
		where: { id: { in: transactions.map((transaction) => transaction.categoryId) } },
		select: { id: true, title: true },
	})

	const chartData = transactions.map((transaction) => ({
		category: categories.find((category) => category.id === transaction.categoryId)?.title || 'Desconhecido',
		spent: transaction._sum.valueInCents,
	}))

	return chartData
}

export const GetChartsDataUseCase = {
	handle,
}
