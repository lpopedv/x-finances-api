import { prisma } from '~/lib'
import type { Transaction } from '~/schemas/transaction'

const handle = async (): Promise<Transaction[]> => {
	const databaseTransactions = await prisma.transaction.findMany()

	const parsedTransactions = databaseTransactions.map(
		(transaction): Transaction => ({
			id: transaction.id,
			categoryId: transaction.categoryId,
			title: transaction.title,
			movement: transaction.movement as 'income' | 'outgoing',
			valueInCents: transaction.valueInCents,
			date: transaction.date?.toISOString() ?? undefined,
			isFixed: transaction.isFixed,
			isPaid: transaction.isPaid,
		}),
	)

	return parsedTransactions
}

export const ListTransactionsUseCase = {
	handle,
}
