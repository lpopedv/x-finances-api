import { afterAll, describe, it, expect } from 'vitest'
import type { Category } from '~/schemas/category'
import type { Transaction } from '~/schemas/transaction'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from '../categories/create-category-usecase'
import { CreateTransactionUseCase } from './create-transaction-usecase'
import { UpdateTransactionUseCase } from './update-transaction-usecase'
import { CategoryNotFoundError } from '~/errors/category-not-found-error'

afterAll(async () => await TestHelpers.clearDatabase())

describe('UpdateTransactionUseCase.handle', () => {
	it('should be able to update a transaction', async () => {
		const newCategoryData: Category = {
			title: 'Category for update test',
			description: 'Category used for update transaction use case',
		}
		const { id: categoryId } = await CreateCategoryUseCase.handle(newCategoryData)
		if (categoryId === undefined) throw new Error('Category ID not found')

		const newTransactionData: Transaction = {
			categoryId,
			title: 'Transaction to update',
			movement: 'outgoing',
			valueInCents: 2000,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: false,
		}
		const createdTransaction = await CreateTransactionUseCase.handle(newTransactionData)

		const updatedTransactionData: Transaction = {
			id: createdTransaction.id,
			categoryId,
			title: 'Updated Transaction Title',
			movement: 'income',
			valueInCents: 2500,
			date: new Date().toISOString(),
			isFixed: true,
			isPaid: true,
		}

		const updatedTransaction = await UpdateTransactionUseCase.handle(updatedTransactionData)

		expect(updatedTransaction.id).toBeDefined()
		expect(updatedTransaction.title).toEqual(updatedTransactionData.title)
		expect(updatedTransaction.movement).toEqual(updatedTransactionData.movement)
		expect(updatedTransaction.valueInCents).toEqual(updatedTransactionData.valueInCents)
		expect(updatedTransaction.date).toEqual(updatedTransactionData.date)
		expect(updatedTransaction.isFixed).toEqual(updatedTransactionData.isFixed)
		expect(updatedTransaction.isPaid).toEqual(updatedTransactionData.isPaid)
	})

	it('should not update a transaction if the category does not exist', async () => {
		const newCategoryData: Category = {
			title: 'Category for update failure test',
			description: 'Category used for update failure use case',
		}
		const { id: categoryId } = await CreateCategoryUseCase.handle(newCategoryData)
		if (categoryId === undefined) throw new Error('Category ID not found')

		const newTransactionData: Transaction = {
			categoryId,
			title: 'Transaction for update failure',
			movement: 'outgoing',
			valueInCents: 2000,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: false,
		}
		const createdTransaction = await CreateTransactionUseCase.handle(newTransactionData)

		const updatedTransactionData: Transaction = {
			id: createdTransaction.id,
			categoryId: 0,
			title: 'Updated Transaction with invalid category',
			movement: 'outgoing',
			valueInCents: 3000,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: true,
		}

		await expect(UpdateTransactionUseCase.handle(updatedTransactionData)).rejects.toBeInstanceOf(CategoryNotFoundError)
	})
})
