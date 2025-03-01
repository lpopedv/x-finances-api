import { afterAll, describe, it, expect } from 'vitest'
import type { Category } from '~/schemas/category'
import { TestHelpers } from '~/utils/test-helpers'
import { ListCategoriesUseCase } from './list-categories-usecase'
import { CreateCategoryUseCase } from './create-category-usecase'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to list all categories', async () => {
		const category01: Category = {
			title: 'New Category Test 01',
			description: 'Category 01 for test use case',
		}

		const category02: Category = {
			title: 'New Category Test 02',
			description: 'Category 02 for test use case',
		}

		await CreateCategoryUseCase.handle(category01)
		await CreateCategoryUseCase.handle(category02)

		const categories = await ListCategoriesUseCase.handle()

		expect(categories).toHaveLength(2)
	})
})
