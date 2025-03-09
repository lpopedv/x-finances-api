import { prisma } from '~/database/prisma-client'
import { CategoryNotFoundError } from '~/errors/category-not-found-error'
import type { Transaction } from '~/schemas/transaction'

const handle = async (transaction: Transaction): Promise<Transaction> => {
	const { categoryId, title, movement, valueInCents, date, isFixed, isPaid } = transaction

	const category = await prisma.category.findFirst({
		where: {
			id: categoryId,
		},
	})

	if (category === null) throw new CategoryNotFoundError(categoryId)

	const newTransaction = await prisma.transaction.create({
		data: {
			categoryId,
			title,
			movement,
			valueInCents,
			date: date ? new Date(date) : undefined,
			isFixed,
			isPaid,
		},
	})

	return {
		id: newTransaction.id,
		categoryId: newTransaction.categoryId,
		title: newTransaction.title,
		movement: newTransaction.movement as 'income' | 'outgoing',
		valueInCents: newTransaction.valueInCents,
		date: newTransaction.date?.toISOString() ?? undefined,
		isFixed: newTransaction.isFixed,
		isPaid: newTransaction.isPaid,
	}
}

export const CreateTransactionUseCase = {
	handle,
}
