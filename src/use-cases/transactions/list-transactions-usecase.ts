import { prisma } from '~/database/prisma-client'
import type { Transaction } from '~/schemas/transaction'

const handle = async (): Promise<Transaction[]> => {
	const databaseTransactions = await prisma.transaction.findMany({
		include: {
			category: true,
		},
	})

	const parsedTransactions = databaseTransactions.map(
		(transaction): Transaction => ({
			id: transaction.id,
			categoryId: transaction.categoryId,
			title: transaction.title,
			category: {
				title: transaction.category.title,
			},
			movement: transaction.movement as 'income' | 'outgoing',
			valueInCents: transaction.valueInCents,
			date: transaction.date?.toISOString() ?? undefined,
			dueDate: transaction.dueDate?.toUTCString() ?? undefined,
			isFixed: transaction.isFixed,
			isPaid: transaction.isPaid,
		}),
	)

	return parsedTransactions
}

export const ListTransactionsUseCase = {
	handle,
}
