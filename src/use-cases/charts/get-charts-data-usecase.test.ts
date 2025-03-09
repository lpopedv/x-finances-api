import { afterAll, describe, it, expect } from 'vitest'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from '../categories/create-category-usecase'
import { CreateTransactionUseCase } from '../transactions/create-transaction-usecase'
import { GetChartsDataUseCase } from './get-charts-data-usecase'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to get spentsByCategory data', async () => {
		const category01 = await CreateCategoryUseCase.handle({ title: 'Category 01' })
		const category02 = await CreateCategoryUseCase.handle({ title: 'Category 02' })

		const category01Transaction01 = await CreateTransactionUseCase.handle({
			categoryId: category01.id as number,
			title: 'transaction 01 category 01',
			isFixed: false,
			isPaid: false,
			movement: 'outgoing',
			valueInCents: 15000,
			date: new Date().toISOString(),
		})

		const category01Transaction02 = await CreateTransactionUseCase.handle({
			categoryId: category01.id as number,
			title: 'transaction 02 category 01',
			isFixed: false,
			isPaid: false,
			movement: 'outgoing',
			valueInCents: 25000,
			date: new Date().toISOString(),
		})

		const category02Transaction01 = await CreateTransactionUseCase.handle({
			categoryId: category02.id as number,
			title: 'transaction 01 category 02',
			isFixed: true,
			isPaid: false,
			movement: 'outgoing',
			valueInCents: 20000,
			date: new Date().toISOString(),
		})

		const category01Total = category01Transaction01.valueInCents + category01Transaction02.valueInCents
		const category02Total = category02Transaction01.valueInCents

		const { spentsByCategory } = await GetChartsDataUseCase.handle()

		expect(spentsByCategory[0].category).toEqual(category01.title)
		expect(spentsByCategory[0].spent).toEqual(category01Total)

		expect(spentsByCategory[1].category).toEqual(category02.title)
		expect(spentsByCategory[1].spent).toEqual(category02Total)
	})
})
