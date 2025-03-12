import { prisma } from '~/database/prisma-client'
import { CategoryNotFoundError } from '~/errors/category-not-found-error'
import type { Transaction } from '~/schemas/transaction'

const handle = async (transaction: Transaction): Promise<Transaction> => {
	const { id, categoryId, title, movement, valueInCents, date, dueDate, isFixed, isPaid } = transaction

	const category = await prisma.category.findFirst({
		where: {
			id: categoryId,
		},
	})

	if (category === null) throw new CategoryNotFoundError(categoryId)

	const updatedTransaction = await prisma.transaction.update({
		where: {
			id,
		},
		data: {
			categoryId,
			title,
			movement,
			valueInCents,
			date,
			dueDate,
			isFixed,
			isPaid,
		},
	})

	return {
		id: updatedTransaction.id,
		categoryId: updatedTransaction.categoryId,
		title: updatedTransaction.title,
		movement: updatedTransaction.movement as 'income' | 'outgoing',
		valueInCents: updatedTransaction.valueInCents,
		date: updatedTransaction.date?.toISOString() ?? undefined,
		dueDate: updatedTransaction.dueDate?.toISOString() ?? undefined,
		isFixed: updatedTransaction.isFixed,
		isPaid: updatedTransaction.isPaid,
	}
}

export const UpdateTransactionUseCase = {
	handle,
}
