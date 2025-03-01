import { afterAll, describe, it, expect } from 'vitest'
import type { Category } from '~/schemas/category'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from '../categories/create-category-usecase'
import { ListTransactionsUseCase } from './list-transactions-usecase'
import type { Transaction } from '~/schemas/transaction'
import { CreateTransactionUseCase } from './create-transaction-usecase'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to list all transactions', async () => {
		const category: Category = {
			title: 'New Category Test ',
			description: 'Category for test use case',
		}

		const { id: categoryId } = await CreateCategoryUseCase.handle(category)

		if (categoryId === undefined) throw new Error('Category not found')

		const newTransactionData01: Transaction = {
			categoryId,
			title: 'New Transaction Test 01',
			movement: 'outgoing',
			valueInCents: 1500,
			date: new Date().toISOString(),
			isFixed: false,
			isPaid: true,
		}

		const newTransactionData02: Transaction = {
			categoryId,
			title: 'New Transaction Test 02',
			movement: 'income',
			valueInCents: 1200,
			date: new Date().toISOString(),
			isFixed: true,
			isPaid: false,
		}

		await CreateTransactionUseCase.handle(newTransactionData01)
		await CreateTransactionUseCase.handle(newTransactionData02)

		const transactions = await ListTransactionsUseCase.handle()

		expect(transactions).toHaveLength(2)
	})
})
