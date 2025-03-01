import { afterAll, describe, it, expect } from 'vitest'
import type { Category } from '~/schemas/category'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from '../categories/create-category-usecase'
import type { Transaction } from '~/schemas/transaction'
import { CreateTransactionUseCase } from './create-transaction-usecase'
import { CategoryNotFoundError } from '~/errors/category-not-found-error'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to create a new transaction', async () => {
		const newCategoryData: Category = {
			title: 'New Category Test',
			description: 'Category for test use case',
		}

		const { id: categoryId } = await CreateCategoryUseCase.handle(newCategoryData)

		if (categoryId === undefined) throw new Error('Category ID not found')

		const newTransactionData: Transaction = {
			categoryId,
			title: 'New Transaction Test',
			movement: 'outgoing',
			valueInCents: 1500,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: true,
		}

		const {
			id: transactionId,
			title,
			movement,
			valueInCents,
			date,
			isFixed,
			isPaid,
		} = await CreateTransactionUseCase.handle(newTransactionData)

		expect(transactionId).toBeDefined()
		expect(title).toEqual(newTransactionData.title)
		expect(movement).toEqual(newTransactionData.movement)
		expect(valueInCents).toEqual(newTransactionData.valueInCents)
		expect(date).toEqual(newTransactionData.date)
		expect(isFixed).toEqual(newTransactionData.isFixed)
		expect(isPaid).toEqual(newTransactionData.isPaid)
	})

	it('should not be able to create a new transaction if it does not exist', async () => {
		const errorTransaction: Transaction = {
			categoryId: 0,
			title: 'New Transaction Test',
			movement: 'outgoing',
			valueInCents: 1500,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: true,
		}

		await expect(CreateTransactionUseCase.handle(errorTransaction)).rejects.toBeInstanceOf(CategoryNotFoundError)
	})
})
